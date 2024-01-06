import {
  modifiers,
  useItemStatsApi,
  useItemsApi,
  useUserLoadoutApi,
} from '@mhgo/front';
import { useUser } from '../../../hooks/useUser';
import { DEFAULT_STATS } from '../../../utils/consts';

import s from './ItemStats.module.scss';
import { Stats } from '@mhgo/types';

export const ItemStats = ({
  itemId,
  compare = false,
}: {
  itemId: string;
  compare?: boolean;
}) => {
  const { userId } = useUser();
  const { data: items } = useItemsApi();
  const { data: itemStats } = useItemStatsApi(itemId);
  const { data: userLoadout } = useUserLoadoutApi(userId);

  // We check which slot the item goes to
  const itemSlot = items.find(i => i.id === itemId)?.slot;
  // We check the ID of item already occupying that slot
  const slottedItemId =
    userLoadout.find(loadoutSlot => loadoutSlot.slot === itemSlot)?.itemId ??
    null;

  const { data: slottedItemStats = {} } = useItemStatsApi(slottedItemId);

  if (!itemStats) return null;
  if (!itemSlot) return null;

  const statsToCompare = Object.keys(DEFAULT_STATS)
    .map(key => ({
      key,
      prev: slottedItemStats[key as keyof Stats] ?? 0,
      next: itemStats[key as keyof Stats] ?? 0,
    }))
    // Dont show stats irrelevant for the item
    .filter(stat => !(stat.prev === 0 && stat.next === 0));

  return (
    <div className={s.itemStats}>
      {compare
        ? statsToCompare.map(stat => (
            <div className={s.itemStats__stat}>
              <span className={s.itemStats__name}>{stat.key}:</span>
              <div className={s.itemStats__change}>
                <span className={s.itemStats__value}>{stat.prev}</span>
                <span className={s.itemStats__value}>→</span>
                <span
                  className={modifiers(s, 'itemStats__value', {
                    downgrade: stat.prev > stat.next,
                    upgrade: stat.prev < stat.next,
                  })}>
                  {stat.next}
                </span>
              </div>
            </div>
          ))
        : statsToCompare.map(stat => (
            <div className={s.itemStats__stat}>
              <span className={s.itemStats__name}>{stat.key}:</span>
              <div className={s.itemStats__change}>{stat.next}</div>
            </div>
          ))}
    </div>
  );
};

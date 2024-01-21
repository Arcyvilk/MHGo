import { useUser, useUserLoadout } from '../../hooks/useUser';
import { QueryBoundary, Tooltip } from '@mhgo/front';
import { Item } from '@mhgo/front';

import s from './EquipmentLoadout.module.scss';

export const EquipmentLoadout = () => (
  <QueryBoundary fallback={<SkeletonEquipmentLoadout />}>
    <Load />
  </QueryBoundary>
);

const SkeletonEquipmentLoadout = () => (
  <div className={s.equipmentView__loadout}>
    <h2 className={s.loadout__title}>Loadout</h2>
    <div className={s.loadout__items}>
      {new Array(6).fill(
        <div className={s.loadout__item}>
          <Item.Skeleton simple />
        </div>,
      )}
    </div>
  </div>
);

const Load = () => {
  const { userId } = useUser();
  const loadout = useUserLoadout(userId);

  return (
    <div className={s.equipmentView__loadout}>
      <h2 className={s.loadout__title}>Loadout</h2>
      <div className={s.loadout__items}>
        {loadout.map((equippedItem, i) => (
          <div className={s.loadout__item} key={i}>
            {equippedItem ? (
              <Tooltip content={equippedItem.name} key={equippedItem.id}>
                <Item data={equippedItem} simple />
              </Tooltip>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

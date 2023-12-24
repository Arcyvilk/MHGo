import { useUser } from '../../hooks/useUser';
import { LoadoutType } from '../../api';
import { Loader, QueryBoundary } from '../../components';

import s from './EquipmentLoadout.module.scss';

import { userLoadout } from '../../_mock/loadout';
import { items } from '../../_mock/items';

const LOADOUT_SLOTS: LoadoutType[] = [
  'weapon',
  'helmet',
  'torso',
  'gloves',
  'hips',
  'legs',
];

export const EquipmentLoadout = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const loadout = useLoadout();

  return (
    <div className={s.equipmentView__loadout}>
      <h2 className={s.loadout__title}>Loadout</h2>
      <div className={s.loadout__items}>
        {loadout.map((equippedItem, i) => (
          <div className={s.loadout__item} key={i}>
            {equippedItem?.id}
          </div>
        ))}
      </div>
    </div>
  );
};

const useLoadout = () => {
  const { userId } = useUser();
  const loadout = userLoadout.find(l => l.userId === userId)?.loadout ?? [];

  const slots = LOADOUT_SLOTS.map(slot => {
    const userSlot = loadout.find(l => l.slot === slot);
    return {
      slot,
      itemId: userSlot?.itemId ?? null,
    };
  });

  const loadoutItems =
    slots.map(slot => items.find(i => i.id === slot.itemId)) ?? [];

  return loadoutItems;
};

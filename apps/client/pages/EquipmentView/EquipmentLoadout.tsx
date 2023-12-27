import { useUser, useUserLoadout } from '../../hooks/useUser';
import { Loader, QueryBoundary, Tooltip } from '../../components';
import { Item } from '../../containers';

import s from './EquipmentLoadout.module.scss';

export const EquipmentLoadout = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
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

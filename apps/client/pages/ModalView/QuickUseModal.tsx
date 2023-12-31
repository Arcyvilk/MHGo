import { useUser, useUserItems } from '../../hooks/useUser';
import { EquipmentDropdown } from '../EquipmentView/EquipmentDropdown';

import s from './ModalView.module.scss';

export const QuickUseModal = () => {
  const { consumableItems } = useConsumableItems();

  return (
    <div className={s.modalView__quickUse}>
      <h2 className={s.modalView__quickUse__title}>Quick use menu</h2>
      <div className={s.modalView__quickUse__items}>
        {consumableItems.map(item => (
          <EquipmentDropdown item={item} />
        ))}
      </div>
    </div>
  );
};

const useConsumableItems = () => {
  const { userId } = useUser();
  const userItems = useUserItems(userId);

  const consumableItems = userItems.filter(
    item => item?.usable && item?.quickUse,
  );

  return { consumableItems };
};

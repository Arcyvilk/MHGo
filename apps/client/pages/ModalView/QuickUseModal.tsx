import { useUser, useUserItems } from '../../hooks/useUser';
import { ItemContextMenu } from '../../containers';

import s from './ModalView.module.scss';

export const QuickUseModal = () => {
  const { consumableItems } = useConsumableItems();
  const hasQuickUseItems = consumableItems?.length > 0;

  return (
    <div className={s.modalView__quickUse}>
      <h2 className={s.modalView__quickUse__title}>Quick use menu</h2>
      {hasQuickUseItems ? (
        <div className={s.modalView__quickUse__items}>
          {consumableItems.map(item => (
            <ItemContextMenu item={item} useOnly />
          ))}
        </div>
      ) : (
        <div className={s.modalView__quickUse__subtitle}>
          You don't have any quick use items!
        </div>
      )}
    </div>
  );
};

const useConsumableItems = () => {
  const { userId } = useUser();
  const userItems = useUserItems(userId);

  const consumableItems = userItems.filter(
    item => item?.usable && item?.quickUse && item.amount > 0,
  );

  return { consumableItems };
};

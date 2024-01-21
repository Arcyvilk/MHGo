import { useUser, useUserItems } from '../../hooks/useUser';
import { ItemContextMenu } from '../../containers';

import s from './ModalView.module.scss';
import { Item, QueryBoundary } from '@mhgo/front';

export const QuickUseModal = () => (
  <QueryBoundary
    fallback={
      <div className={s.modalView__quickUse}>
        <h2 className={s.modalView__quickUse__title}>Quick use menu</h2>
        <div className={s.modalView__quickUse__items}>
          {new Array(4).fill(<Item.Skeleton />)}
        </div>
      </div>
    }>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { consumableItems } = useConsumableItems();
  const hasQuickUseItems = consumableItems?.length > 0;

  return (
    <div className={s.modalView__quickUse}>
      <h2 className={s.modalView__quickUse__title}>Quick use menu</h2>
      {hasQuickUseItems ? (
        <div className={s.modalView__quickUse__items}>
          {consumableItems.map(item => (
            <ItemContextMenu
              key={`context-menu-${item.id}`}
              item={item}
              useOnly
            />
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

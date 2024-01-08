import { Button } from '@mhgo/front';

import s from './PurchaseConfirmation.module.scss';

type PurchaseConfirmationProps = {
  itemId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const PurchaseConfirmation = ({
  itemId,
  setIsModalOpen,
}: PurchaseConfirmationProps) => {
  const { item, moneyNeeded, onPurchase, isSuccess } = useItemPurchase(itemId);

  const canBePurchaseed = moneyNeeded.reduce((sum, curr) => {
    if (curr.userAmount < curr.amount) return false;
    return sum;
  }, true);

  const onYes = () => {
    onPurchase();
  };
  const onNo = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={s.purchaseConfirmation}>
      <h2 className={s.purchaseConfirmation__prompt}>
        Purchasing {item?.name ?? 'item'}...
      </h2>
      <p className={s.purchaseConfirmation__text}>
        Purchasing{' '}
        <span style={{ fontWeight: 800 }}>{item?.name ?? 'this'}</span> will
        consume the following materials:
      </p>
      <div className={s.purchaseConfirmation__materials}>ALL OF 'EM</div>
      <div className={s.purchaseConfirmation__buttons}>
        <Button
          label="Cancel"
          onClick={onNo}
          simple
          variant={Button.Variant.GHOST}
        />
        <Button
          label="Purchase"
          onClick={onYes}
          simple
          disabled={!canBePurchaseed}
          title={canBePurchaseed ? null : 'You are too poor for this!'}
        />
      </div>
    </div>
  );
};

const useItemPurchase = (itemId: string) => {
  // useUserPurchaseItemApi
  return {
    item: { id: itemId, name: 'dupa' },
    moneyNeeded: [{ type: 'base', amount: 1, userAmount: 0 }],
    onPurchase: () => {},
    getItemIngredients: () => {},
    isSuccess: true,
  };
};

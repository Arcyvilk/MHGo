import { useEffect, useMemo } from 'react';
import {
  Button,
  Icon,
  IconType,
  Size,
  useItemsApi,
  useSettingsApi,
  useUserPurchaseItemApi,
  useUserWealthApi,
} from '@mhgo/front';
import { Currency } from '@mhgo/types';
import { useUser } from '../../../hooks/useUser';

import s from './PurchaseConfirmation.module.scss';
import { toast } from 'react-toastify';

type PurchaseConfirmationProps = {
  itemId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const PurchaseConfirmation = ({
  itemId,
  setIsModalOpen,
}: PurchaseConfirmationProps) => {
  const { item, moneyNeeded, onPurchase, canBePurchased } =
    useItemPurchase(itemId);

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
      <p className={s.purchaseConfirmation__text}>This will cost you:</p>
      <div className={s.purchaseConfirmation__lists}>
        {moneyNeeded.map(money => {
          const isTooPoor = money?.userAmount < money?.amount;
          return (
            <div className={s.purchaseConfirmation__price} key={money.id}>
              <Icon icon={money.icon} size={Size.MICRO} />
              <span style={isTooPoor ? { color: 'red' } : { color: 'green' }}>
                {money?.userAmount}
              </span>
              /<span>{money?.amount}</span>
            </div>
          );
        })}
      </div>
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
          disabled={!canBePurchased}
          title={canBePurchased ? null : 'You are too poor for this!'}
        />
      </div>
    </div>
  );
};

const useItemPurchase = (itemId: string) => {
  const { userId } = useUser();
  const { setting: currencies } = useSettingsApi<Currency[]>(
    'currency_types',
    [],
  );
  const { data: userWealth } = useUserWealthApi(userId);
  const { data: items } = useItemsApi();
  const {
    mutate: mutateItemPurchase,
    isSuccess,
    isError,
  } = useUserPurchaseItemApi(userId, itemId);

  const item = useMemo(() => {
    return items.find(i => i.id === itemId);
  }, [itemId]);

  const moneyNeeded = (item?.price ?? []).map(price => {
    const userAmount =
      userWealth.find(currency => currency.id === price.id)?.amount ?? 0;
    const icon = (currencies?.find(currency => currency.id === price.id)
      ?.icon ?? 'Question') as IconType;
    return {
      ...price,
      icon,
      userAmount,
    };
  });

  const canBePurchased = !moneyNeeded?.some(
    money => money.amount > money.userAmount,
  );

  const onPurchase = () => {
    mutateItemPurchase({ amount: 1 });
  };

  useEffect(() => {
    if (isSuccess) toast.success('Item successfully purchased!');
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error('Crafting failed! Your money was not spent.');
  }, [isError]);

  return {
    item,
    moneyNeeded,
    canBePurchased,
    isSuccess,
    onPurchase,
  };
};

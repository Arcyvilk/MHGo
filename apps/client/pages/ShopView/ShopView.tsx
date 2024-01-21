import {
  CloseButton,
  IconType,
  Loader,
  QueryBoundary,
  useItemsApi,
  useUserWealthApi,
  useSettingsApi,
  CurrencyInfo,
} from '@mhgo/front';
import { Currency, CurrencyType, UserAmount } from '@mhgo/types';

import { ItemContextMenu } from '../../containers';
import { useUser } from '../../hooks/useUser';

import s from './ShopView.module.scss';

export const ShopView = () => {
  return (
    <div className={s.shopView}>
      <div className={s.header}>
        <h1 className={s.header__title}>Shop</h1>
        <Wealth />
      </div>
      <QueryBoundary fallback={<Loader withPadding />}>
        <Shop />
      </QueryBoundary>
      <CloseButton backToHome />
    </div>
  );
};

const Wealth = () => {
  const wealth = useWealth();

  return (
    <div className={s.wealth}>
      {wealth.map(currency => (
        <CurrencyInfo key={`wealth-${currency.id}`} price={currency} />
      ))}
    </div>
  );
};

const Shop = () => {
  const { data: items } = useItemsApi();
  const purchasableItems = items.filter(item => item.purchasable);

  return (
    <div className={s.shopView__wrapper}>
      <div className={s.shopView__items}>
        {purchasableItems.map(item => (
          <div key={item.id} className={s.shopView__itemWrapper}>
            <ItemContextMenu item={item} purchaseOnly />
          </div>
        ))}
      </div>
    </div>
  );
};
const useWealth = () => {
  const { userId } = useUser();
  const { data: userWealth } = useUserWealthApi(userId);
  const { setting: currencies } = useSettingsApi('currency_types', [
    { id: 'base' as CurrencyType, icon: 'Question' as IconType },
    { id: 'premium' as CurrencyType, icon: 'Question' as IconType },
  ]);

  const mappedWealth = currencies!.map((currency: Currency) => {
    const userData: UserAmount = userWealth.find(w => w.id === currency.id) ?? {
      id: currency.id,
      amount: 0,
    };
    const wealth = {
      ...userData,
      ...currency,
    };
    return wealth;
  });
  return mappedWealth;
};

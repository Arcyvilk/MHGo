import {
  CloseButton,
  IconType,
  Loader,
  QueryBoundary,
  useItemsApi,
  useUserWealthApi,
  useSettingsApi,
  CurrencyInfo,
  useSounds,
  SoundBG,
} from '@mhgo/front';
import { Currency, CurrencyType, UserAmount } from '@mhgo/types';
import { useUser } from '../../hooks/useUser';

import s from './ShopView.module.scss';
import { useAppContext } from '../../utils/context';
import { useEffect } from 'react';
import { ItemContextMenu } from '../../containers';

export const ShopView = () => {
  return (
    <div className={s.shopView}>
      <div className={s.header}>
        <h1 className={s.header__title}>Shop</h1>
        <Wealth />
      </div>
      <QueryBoundary fallback={<Loader />}>
        <Shop />
      </QueryBoundary>
      <CloseButton />
    </div>
  );
};

const Wealth = () => {
  const wealth = useWealth();

  return (
    <div className={s.wealth}>
      {wealth.map(currency => (
        <CurrencyInfo price={currency} />
      ))}
    </div>
  );
};

const Shop = () => {
  const { setMusic } = useAppContext();
  const { changeMusic } = useSounds(setMusic);

  const { data: items } = useItemsApi();
  const purchasableItems = items.filter(item => item.purchasable);

  useEffect(() => {
    changeMusic(SoundBG.LOCAL_FORECAST);
    return () => {
      changeMusic(SoundBG.SNOW_AND_CHILDREN);
    };
  }, []);

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

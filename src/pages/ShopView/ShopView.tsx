import { toast } from 'react-toastify';

import { CloseButton, Icon, Loader, QueryBoundary } from '../../components';
import { Size } from '../../utils/size';
import { Item } from '../../containers';

import s from './ShopView.module.scss';

import { currencies } from '../../_mock/wealth';
import { userWealth } from '../../_mock/save';
import { USER_ID } from '../../_mock/settings';
import { items } from '../../_mock/items';

export const ShopView = () => {
  return (
    <div className={s.shopView}>
      <Header />
      <QueryBoundary fallback={<Loader />}>
        <Shop />
      </QueryBoundary>
      <CloseButton />
    </div>
  );
};

const Header = () => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>Shop</h1>
      <Wealth />
    </div>
  );
};

const Shop = () => {
  const items = useItems();
  const onItemClick = () => {
    toast.error('You are too poor for this!');
  };

  return (
    <div className={s.shopView__wrapper}>
      <div className={s.shopView__items}>
        {items.map(item => (
          <div className={s.shopView__itemWrapper}>
            <Item data={item} onClick={onItemClick} key={item.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

const useItems = () => {
  const purchasableItems = items.filter(item => item.purchasable);
  return purchasableItems;
};

const Wealth = () => {
  const wealth = useWealth(USER_ID);

  return (
    <div className={s.wealth}>
      {wealth.map(currency => (
        <Currency currency={currency} />
      ))}
    </div>
  );
};

// TODO make type for currency
const Currency = ({ currency }: { currency: any }) => {
  return (
    <div className={s.currency}>
      <Icon icon={currency.icon} size={Size.TINY} />
      <span>{currency.amount ?? 0}</span>
    </div>
  );
};

const useWealth = (userId: string) => {
  const user = userWealth.find(user => user.userId === userId);
  const mappedWealth = currencies.map(currency => {
    const userData = user?.wealth.find(w => w.id === currency.id);
    return {
      ...userData,
      ...currency,
    };
  });
  return mappedWealth;
};

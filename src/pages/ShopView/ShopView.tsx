import { CloseButton } from '../../components/CloseButton';
import { userWealth, currencies } from '../../_mock/wealth'; // TODO replace with API

import s from './ShopView.module.scss';
import { Icon } from '../../components/Icon';

export const ShopView = () => {
  return (
    <div className={s.shopView}>
      <Header />
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

const Wealth = () => {
  const MOCK_USER_ID = '1';
  const wealth = useWealth(MOCK_USER_ID);

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
      <Icon icon={currency.icon} />
      <span>{currency.amount}</span>
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

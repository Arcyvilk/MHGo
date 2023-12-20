import { CloseButton } from '../../components/CloseButton';
import { Icon } from '../../components/Icon';
import { Size } from '../../utils/size';

import s from './ShopView.module.scss';

// TODO replace with API
import { currencies } from '../../_mock/wealth';
import { userWealth } from '../../_mock/save';
import { USER_ID } from '../../_mock/settings';

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

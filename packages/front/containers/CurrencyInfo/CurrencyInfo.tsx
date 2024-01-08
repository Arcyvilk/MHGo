import { Currency, UserAmount } from '@mhgo/types';
import s from './CurrencyInfo.module.scss';
import { Icon, IconType, Size, modifiers, useSettingsApi } from '../..';

type CurrencyInfoProps = { price: UserAmount; small?: boolean };
export const CurrencyInfo = ({ price, small }: CurrencyInfoProps) => {
  const { setting } = useSettingsApi<Currency[]>('currency_types', []);

  const icon =
    (setting!.find(curr => curr.id === price.id)?.icon as IconType) ??
    ('Question' as IconType);

  return (
    <div className={modifiers(s, 'currency', price.id, { small })}>
      <Icon icon={icon} size={small ? Size.MICRO : Size.TINY} />
      <span>{price.amount ?? 0}</span>
    </div>
  );
};

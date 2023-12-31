import { Icon } from '@mhgo/components';
import { modifiers } from '@mhgo/components';
import { Size } from '@mhgo/components';

import s from './Item.module.scss';

type ItemProps = {
  data: {
    id: string;
    img: string;
    name: string;
    description: string;
    rarity: number;
    price: number;
    purchasable: boolean;
    amount?: number;
    filter?: string;
  };
  onClick?: () => void;
  simple?: boolean;
  isNotOwned?: boolean;
};
export const Item = ({
  data,
  onClick,
  simple,
  isNotOwned = false,
}: ItemProps) => {
  const { img, filter, amount, rarity, name, purchasable, price } = data;
  if (simple)
    return (
      <div className={s.item__simple}>
        <img
          src={img}
          style={{ filter }}
          className={modifiers(s, 'tile__image', 'simple', {
            isNotOwned,
          })}
        />
        {amount ? (
          <div className={modifiers(s, 'tile__amount', { isNotOwned })}>
            {amount}
          </div>
        ) : null}
      </div>
    );
  return (
    <button className={modifiers(s, 'item', { isNotOwned })} onClick={onClick}>
      <div className={modifiers(s, 'item__tile', `rarity-${rarity}`)}>
        <img
          src={img}
          style={{ filter }}
          className={modifiers(s, 'tile__image', { isNotOwned })}
        />
        <div className={modifiers(s, 'tile__rarity', `rarity-${rarity}`)}>
          Rarity {rarity}
        </div>
        {amount ? (
          <div className={modifiers(s, 'tile__amount', { isNotOwned })}>
            {amount}
          </div>
        ) : null}
      </div>
      <div className={s.item__name}>{name}</div>
      {purchasable && (
        <div className={s.item__price}>
          <Icon icon="Paw" size={Size.MICRO} /> {price}
        </div>
      )}
    </button>
  );
};

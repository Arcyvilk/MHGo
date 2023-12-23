import { Icon } from '../../components';
import { modifiers } from '../../utils/modifiers';
import { Size } from '../../utils/size';

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
};
export const Item = ({ data, onClick, simple }: ItemProps) => {
  const { img, filter, amount, rarity, name, purchasable, price } = data;
  if (simple)
    return (
      <div className={s.item__simple}>
        <img
          src={img}
          style={{ filter }}
          className={modifiers(s, 'tile__image', 'simple')}
        />
        {amount ? <div className={s.tile__amount}>{amount}</div> : null}
      </div>
    );
  return (
    <button className={s.item} onClick={onClick}>
      <div className={modifiers(s, 'item__tile', `rarity-${rarity}`)}>
        <img src={img} style={{ filter }} className={s.tile__image} />
        <div className={modifiers(s, 'tile__rarity', `rarity-${rarity}`)}>
          Rarity {rarity}
        </div>
        {amount ? <div className={s.tile__amount}>{amount}</div> : null}
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

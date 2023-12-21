import { Icon } from '../../components';
import { modifiers } from '../../utils/modifiers';
import { Size } from '../../utils/size';
import s from './Item.module.scss';

type ItemProps = {
  id: string;
  img: string;
  name: string;
  description: string;
  rarity: number;
  price: number;
  purchasable: boolean;
  amount?: number;
  filter?: string;
  onClick?: () => void;
  simple?: boolean;
};
export const Item = ({
  // id,
  img,
  name,
  // description,
  rarity,
  amount,
  price,
  purchasable,
  filter,
  onClick,
  simple,
}: ItemProps) => {
  if (simple)
    return (
      <img
        src={img}
        style={{ filter }}
        className={modifiers(s, 'tile__image', 'simple')}
      />
    );
  return (
    <button className={s.item} onClick={onClick}>
      <div className={modifiers(s, 'item__tile', `rarity-${rarity}`)}>
        <img src={img} style={{ filter }} className={s.tile__image} />
        <div className={modifiers(s, 'tile__rarity', `rarity-${rarity}`)}>
          Rarity {rarity}
        </div>
        {amount && <div className={s.tile__amount}>{amount}</div>}
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

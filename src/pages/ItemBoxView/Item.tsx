import { modifiers } from '../../utils/modifiers';
import s from './Item.module.scss';

type ItemProps = {
  id: string;
  img: string;
  name: string;
  description: string;
  rarity: number;
  amount: number;
};
export const Item = (props: ItemProps) => {
  return (
    <button className={s.item}>
      <div className={modifiers(s, 'item__tile', `rarity-${props.rarity}`)}>
        <img className={s.tile__image} src={props.img} />
        <div className={modifiers(s, 'tile__rarity', `rarity-${props.rarity}`)}>
          Rarity {props.rarity}
        </div>
        <div className={s.tile__amount}>{props.amount}</div>
      </div>
      <div className={s.item__name}>{props.name}</div>
    </button>
  );
};
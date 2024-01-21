import {
  modifiers,
  CurrencyInfo,
  SoundSE,
  useSounds,
  QueryBoundary,
  Loader,
  Skeleton,
} from '@mhgo/front';

import s from './Item.module.scss';
import { UserAmount } from '@mhgo/types';

type ItemProps = {
  data: {
    id: string;
    img: string;
    name: string;
    description: string;
    rarity: number;
    purchasable: boolean;
    price?: UserAmount[];
    amount?: number;
    filter?: string;
  };
  onClick?: () => void;
  simple?: boolean;
  isNotOwned?: boolean;
};

export const Item = (props: ItemProps) => (
  <QueryBoundary fallback={<Loader noPadding />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ data, onClick, simple, isNotOwned = false }: ItemProps) => {
  const { img, filter, amount, rarity, name, purchasable, price = [] } = data;
  const { playSound } = useSounds(undefined);

  const onButtonClick = () => {
    playSound(SoundSE.CLICK);
    if (onClick) onClick();
  };

  if (simple)
    return (
      <div
        id={data.id}
        className={modifiers(s, 'item__simple', { isNotOwned })}>
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
    <button
      id={data.id}
      className={modifiers(s, 'item', { isNotOwned })}
      onClick={onButtonClick}>
      {purchasable && (
        <div className={s.item__price}>
          {price?.map(p => (
            <div
              key={`price-${p.id}`}
              className={modifiers(s, 'item__price', p.id)}>
              <CurrencyInfo price={p} small />
            </div>
          ))}
        </div>
      )}
      <div className={s.item__primary}>
        <div className={modifiers(s, 'item__tile', `rarity-${rarity}`)}>
          <img src={img} style={{ filter }} className={s.tile__image} />
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
      </div>
    </button>
  );
};

const ItemSkeleton = () => (
  <div className={modifiers(s, 'item', { isNotOwned: true })}>
    <div className={s.item__primary}>
      <div className={modifiers(s, 'item__tile', `rarity-1`)}>
        <Skeleton width="60px" height="60px" />
        <div className={modifiers(s, 'tile__rarity', `rarity-1`)}>Rarity ?</div>
      </div>
      <div className={s.item__name}>
        <Skeleton width="100%" height="2rem" />
      </div>
    </div>
  </div>
);

Item.Skeleton = ItemSkeleton;

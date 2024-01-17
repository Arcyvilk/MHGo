import {
  addCdnUrl,
  Button,
  CloseButton,
  Icon,
  useNavigateWithScroll,
} from '@mhgo/front';
import { Size } from '@mhgo/front';
import { usePaintballs } from '../../hooks/usePaintballs';
import { useUser } from '../../hooks/useUser';

import s from './PaintballView.module.scss';

export const PaintballView = () => {
  const { userId } = useUser();
  const paintballs = usePaintballs(userId);

  return (
    <div className={s.paintballView}>
      <div className={s.header}>
        <div className={s.header__title}>Paintballs</div>
        <Paintballs amount={paintballs} />
      </div>
      {paintballs === 0 && <NoPaintballs />}
      <CloseButton />
    </div>
  );
};

type PaintballsProps = { amount: number };
const Paintballs = ({ amount }: PaintballsProps) => {
  return (
    <div className={s.paintballs}>
      <Icon icon="Paintball" size={Size.TINY} />
      <span>{amount}</span>
    </div>
  );
};

const NoPaintballs = () => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const onShopClick = () => {
    navigateWithoutScroll('/shop');
  };

  return (
    <div className={s.paintballView__wrapper}>
      <div className={s.paintballView__title}>You have no paintballs :C</div>
      <Button label="Go to the shop and buy some!" onClick={onShopClick} />
      <img
        className={s.paintballView__image}
        src={addCdnUrl('/misc/sad_palico.png')}
      />
    </div>
  );
};

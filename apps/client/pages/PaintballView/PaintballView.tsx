import { useNavigate } from 'react-router-dom';

import { Button, CloseButton, Icon } from '../../components';
import { Size } from '../../utils/size';

import s from './PaintballView.module.scss';

import { userItems } from '../../_mock/save';
import { USER_ID } from '../../_mock/settings';
import { addCdnUrl } from '../../utils/addCdnUrl';

export const PaintballView = () => {
  const userId = USER_ID;
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
  const navigate = useNavigate();
  const onShopClick = () => {
    navigate('/shop');
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

const usePaintballs = (userId: string) => {
  const user = userItems.find(user => user.userId === userId);
  const paintballs = user?.items.find(item => item.id === 'paintball');
  return paintballs?.amount ?? 0;
};

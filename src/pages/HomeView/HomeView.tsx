import { useNavigate } from 'react-router-dom';

import { IconType } from '../../assets/icons';
import { Icon } from '../../components';
import { Size } from '../../utils/size';
import { Map } from './Map';

import s from './HomeView.module.scss';

const TEMP_SRC =
  'https://cdn.masochist.me/badges/1003590_6423923a819d3d1917bfa22b.png';

export const HomeView = () => {
  const navigate = useNavigate();

  const onInventoryClick = () => navigate('/inventory');
  const onItemsClick = () => navigate('/items');
  const onPaintballClick = () => navigate('/paintball');
  const onYouClick = () => navigate('/you');
  const onShopClick = () => navigate('/shop');
  const onQuestClick = () => navigate('/quest');

  const onTest = () => navigate('/fight?id=1');

  return (
    <div className={s.homeView}>
      <h1>HomeView</h1>
      <Map />
      <div className={s.actions}>
        <ActionButton icon="Monster" onClick={onTest} />
        <div className={s.actions__top}>
          <ActionButton icon="Face" onClick={onYouClick} />
          <ActionButton icon="Armory" onClick={onInventoryClick} />
          <ActionButton icon="Paintball" onClick={onPaintballClick} />
          <ActionButton icon="Potion" onClick={onItemsClick} />
          <ActionButton icon="Shop" onClick={onShopClick} />
        </div>
        <QuestButton onClick={onQuestClick} />
      </div>
    </div>
  );
};

type ActionButtonProps = {
  icon: IconType;
  onClick: () => void;
};
const ActionButton = ({ icon, onClick }: ActionButtonProps) => {
  return (
    <button className={s.actionButton} onClick={onClick}>
      <Icon icon={icon} size={Size.TINY} />
    </button>
  );
};

const QuestButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className={s.button} onClick={onClick}>
      <img className={s.button__image} src={TEMP_SRC} />
      <div className={s.button__desc}>
        <h2 className={s.button__title}>A Royal Audience with Rathian</h2>
        <p className={s.button__subtitle}>
          Chapter 9: Bright Lights and Beasts
        </p>
      </div>
      <img className={s.button__image} src={TEMP_SRC} />
    </button>
  );
};

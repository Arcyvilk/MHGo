import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button, CloseButton, Icon } from '../../components';
import { modifiers } from '../../utils/modifiers';

import s from './FightView.module.scss';

import { monsters } from '../../_mock/monsters';
import { monsterMarkers } from '../../_mock/mapMarkers';
import { Size } from '../../utils/size';

export const FightView = () => {
  const navigate = useNavigate();
  const { habitat, img, level, name, ...monster } = useMonster();

  const onFight = () => {
    toast.info('Not implemented yet!');
  };
  const onFlee = () => {
    navigate('/');
  };

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      <Header name={name} level={level} />
      <div className={s.fightView__wrapper}>
        <img className={s.fightView__monster} src={img} />
        <div className={s.fightView__buttons}>
          <Button
            label="Fight!"
            onClick={onFight}
            variant={Button.Variant.ACTION}
            simple
          />
          <Button label="Flee!" onClick={onFlee} simple />
        </div>
      </div>
      <CloseButton />
    </div>
  );
};

type HeaderProps = {
  name?: string;
  level?: number;
};
const Header = ({ name = '?', level = 0 }: HeaderProps) => {
  return (
    <div className={s.header}>
      <div className={s.header__difficulty}>
        {new Array(level).fill(null).map(_ => (
          <Icon icon="Star" size={Size.SMALL} />
        ))}
      </div>
      <h1 className={s.header__title}>{name}</h1>
    </div>
  );
};

const useMonster = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');

  const monsterMarker = monsterMarkers.find(m => m.id === markerId);
  const monsterId = monsterMarker?.monsterId;

  const monster = monsters.find(m => m.id === monsterId);
  const fixedMonster = {
    ...monster,
    ...monsterMarker,
  };

  return fixedMonster;
};

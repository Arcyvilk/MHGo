import { useNavigate } from 'react-router-dom';

import { Button, Icon } from '../../components';
import { modifiers } from '../../utils/modifiers';
import { Size } from '../../utils/size';
import { useMonster } from '../../hooks/useMonster';

import s from './FightView.module.scss';

export const PrepareView = () => {
  const navigate = useNavigate();
  const { markerId, monster } = useMonster();
  const { habitat, level, name, img } = monster;

  const onFight = () => {
    navigate(`/fight?id=${markerId}`);
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

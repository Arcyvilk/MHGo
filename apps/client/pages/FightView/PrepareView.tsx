import { useNavigate } from 'react-router-dom';

import { Button, Icon } from '@mhgo/components';
import { modifiers } from '@mhgo/components';
import { Size } from '@mhgo/components';
import { useMonster } from '../../hooks/useMonster';

import s from './FightView.module.scss';
import { HealthBarSimple } from '../../containers';
import { useUserHealthApi } from '../../api';
import { useUser } from '../../hooks/useUser';

export const PrepareView = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { data: userHealth } = useUserHealthApi(userId);
  const { markerId, monster } = useMonster();
  const { habitat, level, name, img } = monster;

  const onFight = () => {
    navigate(`/fight?id=${markerId}&level=${level}`);
  };
  const onFlee = () => {
    navigate('/');
  };

  const isUserAlive = userHealth.currentHealth > 0;

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      <Header name={name} level={level} />
      <div className={s.fightView__wrapper}>
        <img className={s.fightView__monster} src={img} draggable={false} />
        <div className={s.fightView__buttons}>
          <HealthBarSimple
            maxHP={userHealth.maxHealth}
            currentHP={userHealth.currentHealth}
          />
          <Button
            label="Fight!"
            onClick={onFight}
            disabled={!isUserAlive}
            variant={Button.Variant.ACTION}
            title={
              isUserAlive ? null : 'You cannot initiate a fight when dead!'
            }
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

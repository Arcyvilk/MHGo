import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CloseButton,
  Explosions,
  Loader,
  QueryBoundary,
  Rays,
} from '../../components';
import { modifiers } from '../../utils/modifiers';
import { useMonster } from '../../hooks/useMonster';
import { UserHealthBar } from './UserHealthBar';
import { ModalSuccess } from './ModalSuccess';
import { ModalFailure } from './ModalFailure';
import { useUserStatsApi } from '../../api';
import { useUser } from '../../hooks/useUser';

import s from './FightView.module.scss';

export const FightView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);

  const { monster } = useMonster();
  const { habitat, level, baseHP = 0, name, img } = monster;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonsterAlive, setIsMonsterAlive] = useState<boolean>(true);
  const [isPlayerAlive, setIsPlayerAlive] = useState<boolean>(true);
  const [monsterHP, setMonsterHP] = useState<number>(level * baseHP);

  const onMonsterHit = () => {
    if (!isMonsterAlive) return;
    const newHP = monsterHP - (userStats?.attack ?? 1);

    if (newHP > 0) {
      setMonsterHP(newHP);
    } else {
      setMonsterHP(0);
      setIsMonsterAlive(false);
    }
  };

  const onFightEnd = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (!isMonsterAlive || !isPlayerAlive) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
    }
  }, [isMonsterAlive, isPlayerAlive]);

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      {isPlayerAlive && !isMonsterAlive && isModalOpen && (
        <ModalSuccess isOpen setIsOpen={setIsModalOpen} onClose={onFightEnd} />
      )}
      {!isPlayerAlive && isModalOpen && (
        <ModalFailure isOpen setIsOpen={setIsModalOpen} onClose={onFightEnd} />
      )}
      <Header name={name} maxHP={level * baseHP} currentHP={monsterHP} />
      {!isMonsterAlive && <Explosions />}
      <div className={s.fightView__wrapper}>
        {isMonsterAlive && <Rays />}
        <img
          className={modifiers(
            s,
            'fightView__monster',
            { isActive: isMonsterAlive },
            { isDead: !isMonsterAlive },
          )}
          onClick={onMonsterHit}
          src={img}
        />
      </div>
      <UserHealthBar
        setIsPlayerAlive={setIsPlayerAlive}
        isFightFinished={!isMonsterAlive || !isPlayerAlive}
      />
      <CloseButton />
    </div>
  );
};

type HeaderProps = {
  name?: string;
  maxHP: number;
  currentHP: number;
};
const Header = ({ name = '?', maxHP, currentHP }: HeaderProps) => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>{name}</h1>
      <HealthBar maxHP={maxHP} currentHP={currentHP} />
    </div>
  );
};

const HealthBar = ({ maxHP, currentHP }: Omit<HeaderProps, 'name'>) => {
  return (
    <div className={s.healthBar}>
      <div className={s.healthBar__text}>
        {currentHP} / {maxHP}
      </div>
      <div
        className={s.healthBar__fg}
        style={{ width: `${(100 * currentHP) / maxHP}%` }}
      />
      <div className={s.healthBar__bg} />
    </div>
  );
};

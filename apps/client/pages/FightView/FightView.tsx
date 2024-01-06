import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HealthBarMonster, HealthBarUser } from '../../containers';
import {
  CloseButton,
  Death,
  Loader,
  Nuke,
  QueryBoundary,
  Rays,
  SoundSE,
  modifiers,
  useSounds,
  useUserStatsApi,
} from '@mhgo/front';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { useUser } from '../../hooks/useUser';
import { ModalSuccess } from './ModalSuccess';
import { ModalFailure } from './ModalFailure';

import s from './FightView.module.scss';

export const FightView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { playSESound } = useSounds();
  const navigate = useNavigate();
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);

  const { monster } = useMonsterMarker();
  const { habitat, level, baseHP = 0, name, img } = monster;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonsterAlive, setIsMonsterAlive] = useState<boolean>(true);
  const [isPlayerAlive, setIsPlayerAlive] = useState<boolean>(true);
  const [monsterHP, setMonsterHP] = useState<number>(level * baseHP);

  const onMonsterHit = () => {
    if (!isMonsterAlive || !isPlayerAlive) return;
    const newHP = monsterHP - (userStats?.attack ?? 1);

    if (newHP > 0) {
      playSESound(SoundSE.SLAP);
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
    if (!isPlayerAlive || !isMonsterAlive) {
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
      {!isMonsterAlive && <Nuke />}
      {!isPlayerAlive && <Death />}
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
      <HealthBarUser
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
      <HealthBarMonster maxHP={maxHP} currentHP={currentHP} />
    </div>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HealthBarMonster, HealthBarUser, Tutorial } from '../../containers';
import {
  CloseButton,
  Death,
  Loader,
  Nuke,
  QueryBoundary,
  Rays,
  SoundBG,
  SoundSE,
  modifiers,
  useSounds,
  useUpdateUserHealthApi,
  useUserHealthApi,
  useUserStatsApi,
} from '@mhgo/front';

import { useAppContext } from '../../utils/context';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { useUser, useUserTutorial } from '../../hooks/useUser';
import { ModalSuccess } from './ModalSuccess';
import { ModalFailure } from './ModalFailure';
import { MonsterAttackTimer } from './MonsterAttackTimer';

import s from './FightView.module.scss';
import { useInterval } from '../../hooks/useInterval';

export const FightView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { setMusic } = useAppContext();
  const { changeMusic, playSound } = useSounds(setMusic);
  const navigate = useNavigate();
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);
  const { isFinishedTutorial } = useUserTutorial(userId);

  const { monster } = useMonsterMarker();
  const { habitat, level, baseHP = 0, name, img } = monster;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonsterAlive, setIsMonsterAlive] = useState<boolean>(true);
  const [isPlayerAlive, setIsPlayerAlive] = useState<boolean>(true);
  const [monsterHP, setMonsterHP] = useState<number>(level * baseHP);

  const isFightFinished = useMemo(
    () => !isPlayerAlive || !isMonsterAlive,
    [isPlayerAlive, isMonsterAlive],
  );

  const { isUserHit, percentageToNextHit } = useMonsterAttack(
    isFightFinished,
    setIsPlayerAlive,
  );

  useEffect(() => {
    changeMusic(SoundBG.EDGE_OF_THE_GALAXY);
    return () => {
      changeMusic(SoundBG.SNOW_AND_CHILDREN);
    };
  }, []);

  const onMonsterHit = () => {
    if (!isMonsterAlive || !isPlayerAlive) return;
    const newHP = monsterHP - (userStats?.attack ?? 1);

    if (newHP > 0) {
      playSound(SoundSE.PUNCH);
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
      {!isFinishedTutorial && <Tutorial stepFrom={7} stepTo={9} />}
      {isPlayerAlive && !isMonsterAlive && isModalOpen && (
        <ModalSuccess isOpen setIsOpen={setIsModalOpen} onClose={onFightEnd} />
      )}
      {!isPlayerAlive && isModalOpen && (
        <ModalFailure isOpen setIsOpen={setIsModalOpen} onClose={onFightEnd} />
      )}
      <Header name={name} maxHP={level * baseHP} currentHP={monsterHP} />
      {!isFightFinished && (
        <MonsterAttackTimer percentage={percentageToNextHit} />
      )}
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
      <HealthBarUser isUserHit={isUserHit} />
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

const FRAME_CADENCE = 40;

const useMonsterAttack = (
  isFightFinished: boolean,
  setIsPlayerAlive: (isAlive: boolean) => void,
) => {
  const { setMusic } = useAppContext();
  const { playSound, changeMusic } = useSounds(setMusic);

  const { userId } = useUser();
  const { mutate, isSuccess: isUserHit } = useUpdateUserHealthApi(userId);
  const { data: userHealth } = useUserHealthApi(userId);
  const { monster } = useMonsterMarker();
  const [percentageToNextHit, setPercentageToNextHit] = useState(0);

  const { level, baseAttackSpeed, baseDamage } = monster;

  const attackSpeed = 1000 / baseAttackSpeed;

  useInterval(
    () => {
      playSound(SoundSE.OUCH);
      mutate({
        healthChange: baseDamage * level * -1,
      });
    },
    isFightFinished ? null : attackSpeed,
  );

  useInterval(
    () => {
      const cooldownPerFrame = baseAttackSpeed / FRAME_CADENCE;
      const newPercentage = percentageToNextHit + cooldownPerFrame * 100;

      if (newPercentage > 100) setPercentageToNextHit(newPercentage - 100);
      else setPercentageToNextHit(newPercentage);
    },
    isFightFinished ? null : 1000 / FRAME_CADENCE,
  );

  useEffect(() => {
    if (userHealth?.currentHealth <= 0) {
      setIsPlayerAlive(false);
      changeMusic(SoundBG.HORROR_CREEPY);
    }
  }, [userHealth.currentHealth]);

  return { isUserHit, percentageToNextHit };
};

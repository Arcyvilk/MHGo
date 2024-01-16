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
  useInterval,
  useUpdateUserHealthApi,
  useUserHealthApi,
  useUserStatsApi,
} from '@mhgo/front';
import { happensWithAChanceOf } from '@mhgo/utils';

import { useAppContext } from '../../utils/context';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { useTutorialProgress } from '../../hooks/useTutorial';
import { useUser } from '../../hooks/useUser';

import { ModalSuccess } from './ModalSuccess';
import { ModalFailure } from './ModalFailure';
import { MonsterAttackTimer } from './MonsterAttackTimer';

import s from './FightView.module.scss';

export const FightView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { setMusic } = useAppContext();
  const { changeMusic, playSound } = useSounds(setMusic);
  const navigate = useNavigate();
  const { isFinishedTutorialPartOne } = useTutorialProgress();

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

  const { isUserHit } = useMonsterAttack(isFightFinished, setIsPlayerAlive);
  const { getMonsterNewHP } = useMonsterHealthChange();

  useEffect(() => {
    changeMusic(SoundBG.EDGE_OF_THE_GALAXY);
    return () => {
      changeMusic(SoundBG.SNOW_AND_CHILDREN);
    };
  }, []);

  const onMonsterHit = () => {
    if (!isMonsterAlive || !isPlayerAlive) return;

    const { newHP } = getMonsterNewHP(monsterHP);

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
      <Tutorial
        stepFrom="part3_start"
        stepTo="part3_end"
        requirement={!isFinishedTutorialPartOne}
      />
      {isPlayerAlive && !isMonsterAlive && isModalOpen && (
        <ModalSuccess isOpen setIsOpen={setIsModalOpen} onClose={onFightEnd} />
      )}
      {!isPlayerAlive && isModalOpen && (
        <ModalFailure isOpen setIsOpen={setIsModalOpen} onClose={onFightEnd} />
      )}
      <Header name={name} maxHP={level * baseHP} currentHP={monsterHP} />
      {!isFightFinished && (
        <MonsterAttackTimer isFightFinished={isFightFinished} />
      )}
      {!isMonsterAlive && <Nuke />}
      {!isPlayerAlive && <Death />}
      {isMonsterAlive && <Rays />}
      <div className={s.fightView__wrapper} id="monster_wrapper">
        <img
          className={modifiers(
            s,
            'fightView__monster',
            { isActive: isMonsterAlive },
            { isDead: !isMonsterAlive },
          )}
          onClick={onMonsterHit}
          onContextMenu={e => e.preventDefault()}
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
  const { getPlayerHealthChange } = usePlayerHealthChange();

  const { baseAttackSpeed } = monster;

  const attackSpeed = 1000 / baseAttackSpeed;

  useInterval(
    () => {
      playSound(SoundSE.OUCH);
      const healthChange = getPlayerHealthChange();
      mutate({ healthChange });
    },
    isFightFinished ? null : attackSpeed,
  );

  useEffect(() => {
    if (userHealth?.currentHealth <= 0) {
      setIsPlayerAlive(false);
      changeMusic(SoundBG.HORROR_CREEPY);
    }
  }, [userHealth.currentHealth]);

  return { isUserHit };
};

const usePlayerHealthChange = () => {
  const { userId } = useUser();
  const { monster } = useMonsterMarker();
  const { data: userStats } = useUserStatsApi(userId);

  const { level, baseDamage } = monster;
  const { defense = 0 } = userStats ?? {};

  const getPlayerHealthChange = () => {
    const monsterDamage = baseDamage * level;
    const damageAfterMitigation = Number(
      ((monsterDamage * 100) / (100 + defense)).toFixed(2),
    );
    createDamageNumber(damageAfterMitigation);
    return damageAfterMitigation * -1;
  };

  const createDamageNumber = (damage: number) => {
    const particle = document.createElement('div');
    const classNames = modifiers(s, 'particle', 'playerDmg').split(' ');
    particle.classList.add(...classNames);
    particle.innerText = String(damage);
    const wrapper = document.getElementById('user_health_bar');
    if (wrapper) {
      wrapper.appendChild(particle);
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  };

  return { getPlayerHealthChange };
};

const useMonsterHealthChange = () => {
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);
  const { attack = 1, critChance = 0, critDamage = 100 } = userStats ?? {};

  const getMonsterNewHP = (monsterHP: number) => {
    const userCritDamageMultiplier = 1 + critDamage / 100;
    const isCrit = happensWithAChanceOf(critChance);
    const userFinalDamage = isCrit ? attack * userCritDamageMultiplier : attack;

    const newHP = monsterHP - userFinalDamage;
    createDamageNumber(userFinalDamage, isCrit);
    return { newHP, isCrit };
  };

  const createDamageNumber = (damage: number, isCrit: boolean) => {
    const particle = document.createElement('div');
    const classNames = modifiers(s, 'particle', 'monsterDmg', { isCrit }).split(
      ' ',
    );
    particle.classList.add(...classNames);
    particle.innerText = String(damage);
    const wrapper = document.getElementById('monster_wrapper');
    if (wrapper) {
      wrapper.appendChild(particle);
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  };

  return { getMonsterNewHP };
};

import { useEffect, useMemo, useState } from 'react';

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
  useNavigateWithScroll,
} from '@mhgo/front';

import { useAppContext } from '../../utils/context';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { useTutorialProgress } from '../../hooks/useTutorial';

import { ModalSuccess } from './ModalSuccess';
import { ModalFailure } from './ModalFailure';
import { MonsterAttackTimer } from './MonsterAttackTimer';
import { PlayerDPS, DmgValue } from './PlayerDPS';
import { useMonsterAttack, useMonsterHealthChange } from './utils';

import s from './FightView.module.scss';

export const FightView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { setMusic } = useAppContext();
  const { changeMusic, playSound } = useSounds(setMusic);
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { isFinishedTutorialPartOne } = useTutorialProgress();
  const { getMonsterNewHP, getMonsterRetaliate } = useMonsterHealthChange();

  const { monster, isDummy } = useMonsterMarker();
  const { habitat, level, baseHP = 0, name, img } = monster;

  const [dmgValues, setDmgValues] = useState<DmgValue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonsterAlive, setIsMonsterAlive] = useState<boolean>(true);
  const [isPlayerAlive, setIsPlayerAlive] = useState<boolean>(true);
  const [monsterHP, setMonsterHP] = useState<number>(level * baseHP);

  const isFightFinished = useMemo(
    () => !isPlayerAlive || !isMonsterAlive,
    [isPlayerAlive, isMonsterAlive],
  );

  const onRetaliate = () => {
    if (!isMonsterAlive || !isPlayerAlive) return;
    const isRetaliate = getMonsterRetaliate(monsterHP);
    if (isRetaliate !== null) {
      const { newHP } = isRetaliate;
      handleMonsterAlive(newHP);
    }
  };

  const { isUserHit } = useMonsterAttack(
    isFightFinished,
    setIsPlayerAlive,
    onRetaliate,
  );

  useEffect(() => {
    changeMusic(SoundBG.EDGE_OF_THE_GALAXY);
    return () => {
      changeMusic(SoundBG.SNOW_AND_CHILDREN);
    };
  }, []);

  const handleMonsterAlive = (newHP: number) => {
    if (newHP > 0) {
      playSound(SoundSE.PUNCH);
      setMonsterHP(newHP);
    } else {
      setMonsterHP(0);
      setIsMonsterAlive(false);
    }
  };

  const onMonsterHit = () => {
    if (!isMonsterAlive || !isPlayerAlive) return;
    const { newHP } = getMonsterNewHP(monsterHP, dmgValues, setDmgValues);
    handleMonsterAlive(newHP);
  };

  const onFightEnd = () => {
    setIsModalOpen(false);
    navigateWithoutScroll('/');
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
      {isDummy && <PlayerDPS dmgValues={dmgValues} />}
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

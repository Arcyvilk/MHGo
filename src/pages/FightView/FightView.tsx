import { CloseButton, Rays } from '../../components';
import { modifiers } from '../../utils/modifiers';
import { useMonster } from '../../hooks/useMonster';

import s from './FightView.module.scss';
import { useState } from 'react';

const CURR_ATTACK = 1;

export const FightView = () => {
  const { monster } = useMonster();
  const { habitat, level = 1, baseHP = 0, name, img } = monster;
  const [currentHP, setCurrentHP] = useState<number>(level * baseHP);

  const onMonsterHit = () => {
    setCurrentHP(currentHP - CURR_ATTACK);
  };

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      <Header name={name} maxHP={level * baseHP} currentHP={currentHP} />
      <div className={s.fightView__wrapper}>
        <Rays />
        <img
          className={modifiers(s, 'fightView__monster', { isActive: true })}
          onClick={onMonsterHit}
          src={img}
        />
      </div>
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
    </div>
  );
};

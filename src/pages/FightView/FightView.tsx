import { CloseButton, Rays } from '../../components';
import { modifiers } from '../../utils/modifiers';
import { useMonster } from '../../hooks/useMonster';

import s from './FightView.module.scss';
import { useState } from 'react';

export const FightView = () => {
  const { monster } = useMonster();
  const { habitat, level = 1, baseHP = 0, name, img } = monster;
  const [currentHP, setCurrentHP] = useState<number>(level * baseHP);

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      <Header name={name} maxHP={level * baseHP} currentHP={currentHP} />
      <div className={s.fightView__wrapper}>
        <Rays />
        <img
          className={modifiers(s, 'fightView__monster', { isActive: true })}
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

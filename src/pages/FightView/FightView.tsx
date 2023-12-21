import { useEffect, useState } from 'react';

import { CloseButton, Explosions, Modal, Rays } from '../../components';
import { modifiers } from '../../utils/modifiers';
import { useMonster } from '../../hooks/useMonster';

import s from './FightView.module.scss';
import { useNavigate } from 'react-router-dom';
import { ModalSuccess } from './ModalSuccess';
import { ModalFailure } from './ModalFailure';

const CURR_ATTACK = 10;

export const FightView = () => {
  const navigate = useNavigate();
  const { monster } = useMonster();
  const { habitat, level = 1, baseHP = 0, name, img } = monster;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonsterAlive, setIsMonsterAlive] = useState<boolean>(true);
  const [isPlayerAlive, _setIsPlayerAlive] = useState<boolean>(true);
  const [currentHP, setCurrentHP] = useState<number>(level * baseHP);

  const onMonsterHit = () => {
    if (!isMonsterAlive) return;
    const newHP = currentHP - CURR_ATTACK;

    if (newHP > 0) {
      setCurrentHP(newHP);
    } else {
      setCurrentHP(0);
      setIsMonsterAlive(false);
    }
  };

  const onFightEnd = () => {
    navigate('/');
  };

  useEffect(() => {
    if (!isMonsterAlive || !isPlayerAlive) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
    }
  }, [isMonsterAlive]);

  return (
    <div className={modifiers(s, 'fightView', habitat)}>
      {!isMonsterAlive && (
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onClose={onFightEnd}>
          {isPlayerAlive && <ModalSuccess />}
          {!isPlayerAlive && <ModalFailure />}
        </Modal>
      )}
      <Header name={name} maxHP={level * baseHP} currentHP={currentHP} />
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

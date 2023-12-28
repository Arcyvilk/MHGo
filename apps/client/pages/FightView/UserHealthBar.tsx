import { useEffect } from 'react';

import { useUpdateUserHealth, useUserHealthApi } from '../../api';
import { useMonster } from '../../hooks/useMonster';
import { useUser } from '../../hooks/useUser';
import { useInterval } from '../../hooks/useInterval';
import { Loader, QueryBoundary } from '../../components';

import s from './FightView.module.scss';

type UserHealthBarProps = {
  isFightFinished: boolean;
  setIsPlayerAlive: (isAlive: boolean) => void;
};
export const UserHealthBar = (props: UserHealthBarProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ isFightFinished, setIsPlayerAlive }: UserHealthBarProps) => {
  const { userId } = useUser();
  const { mutate } = useUpdateUserHealth(userId);
  const { data: userHealth } = useUserHealthApi(userId);
  const { monster } = useMonster();
  const { level, baseAttackSpeed, baseDamage } = monster;

  const attackSpeed = 1000 / baseAttackSpeed;

  useInterval(
    () => {
      mutate({
        healthChange: baseDamage * level * -1,
      });
    },
    isFightFinished ? null : attackSpeed,
  );

  useEffect(() => {
    if (userHealth?.currentHealth <= 0) setIsPlayerAlive(false);
  }, [userHealth.currentHealth]);

  return (
    <div className={s.healthBar}>
      <div className={s.healthBar__text}>
        {userHealth.currentHealth} / {userHealth.maxHealth}
      </div>
      <div
        className={s.healthBar__fg}
        style={{
          width: `${(100 * userHealth.currentHealth) / userHealth.maxHealth}%`,
        }}
      />
      <div className={s.healthBar__bg} />
    </div>
  );
};

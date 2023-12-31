import { useEffect } from 'react';

import { useUpdateUserHealth, useUserHealthApi } from '@mhgo/front';
import { useMonster } from '../../hooks/useMonster';
import { useUser } from '../../hooks/useUser';
import { useInterval } from '../../hooks/useInterval';
import { Flash, Loader, QueryBoundary } from '@mhgo/front';
import { modifiers } from '@mhgo/front';

import s from './HealthBar.module.scss';

type HealthBarUserProps = {
  isFightFinished: boolean;
  setIsPlayerAlive: (isAlive: boolean) => void;
};
export const HealthBarUser = (props: HealthBarUserProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ isFightFinished, setIsPlayerAlive }: HealthBarUserProps) => {
  const { userId } = useUser();
  const { mutate, isSuccess: isUserHit } = useUpdateUserHealth(userId);
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
    <div className={s.wrapper}>
      <Flash type="red" isActivated={isUserHit} />
      <div className={modifiers(s, 'healthBar', { isUser: true })}>
        <div className={modifiers(s, 'healthBar__text', { isUser: true })}>
          {userHealth.currentHealth} / {userHealth.maxHealth}
        </div>
        <div
          className={modifiers(s, 'healthBar__fg', { isUser: true })}
          style={{
            width: `${
              (100 * userHealth.currentHealth) / userHealth.maxHealth
            }%`,
          }}
        />
        <div className={modifiers(s, 'healthBar__bg', { isUser: true })} />
      </div>
    </div>
  );
};

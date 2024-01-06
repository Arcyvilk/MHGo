import { useEffect } from 'react';

import {
  useUpdateUserHealthApi,
  useUserHealthApi,
  Flash,
  Loader,
  QueryBoundary,
  modifiers,
  useSounds,
  SoundSE,
} from '@mhgo/front';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { useUser } from '../../hooks/useUser';
import { useInterval } from '../../hooks/useInterval';

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
  const { playSESound } = useSounds();
  const { userId } = useUser();
  const { mutate, isSuccess: isUserHit } = useUpdateUserHealthApi(userId);
  const { data: userHealth } = useUserHealthApi(userId);
  const { monster } = useMonsterMarker();
  const { level, baseAttackSpeed, baseDamage } = monster;

  const attackSpeed = 1000 / baseAttackSpeed;

  useInterval(
    () => {
      playSESound(SoundSE.OUCH);
      mutate({
        healthChange: baseDamage * level * -1,
      });
    },
    isFightFinished ? null : attackSpeed,
  );

  useEffect(() => {
    if (userHealth?.currentHealth <= 0) {
      playSESound(SoundSE.DEATH);
      setIsPlayerAlive(false);
    }
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

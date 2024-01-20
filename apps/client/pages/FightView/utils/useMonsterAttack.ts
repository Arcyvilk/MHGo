import { useEffect } from 'react';

import {
  SoundBG,
  SoundSE,
  useSounds,
  useInterval,
  useUpdateUserHealthApi,
  useUserHealthApi,
  useUserStatsApi,
} from '@mhgo/front';

import { useAppContext } from '../../../utils/context';
import { useMonsterMarker } from '../../../hooks/useMonsterMarker';
import { useUser } from '../../../hooks/useUser';
import { usePlayerHealthChange } from './usePlayerHealthChange';
import { ItemEffect } from '@mhgo/types';

export const useMonsterAttack = (
  isFightFinished: boolean,
  setIsPlayerAlive: (isAlive: boolean) => void,
  getFearMultiplier: (fear: number) => number,
  onRetaliate?: () => void,
) => {
  const { setMusic } = useAppContext();
  const { playSound, changeMusic } = useSounds(setMusic);

  const { userId } = useUser();
  const { mutate, isSuccess: isUserHit } = useUpdateUserHealthApi(userId);
  const { data: userHealth } = useUserHealthApi(userId);
  const { data: userStats } = useUserStatsApi(userId);
  const { fear = 0 } = (userStats?.specialEffects ?? {}) as Record<
    ItemEffect,
    number
  >;
  const { monster } = useMonsterMarker();
  const { getPlayerHealthChange } = usePlayerHealthChange();

  const { baseAttackSpeed } = monster;

  const attackSpeed = 1000 / (getFearMultiplier(fear) * baseAttackSpeed);

  useInterval(
    () => {
      playSound(SoundSE.OUCH);
      const { playerHealthChange } = getPlayerHealthChange();
      if (onRetaliate) onRetaliate();
      mutate({ healthChange: playerHealthChange });
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

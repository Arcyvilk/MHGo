import { useEffect } from 'react';

import {
  SoundBG,
  SoundSE,
  useSounds,
  useInterval,
  useUpdateUserHealthApi,
  useUserHealthApi,
} from '@mhgo/front';

import { useAppContext } from '../../../utils/context';
import { useMonsterMarker } from '../../../hooks/useMonsterMarker';
import { useUser } from '../../../hooks/useUser';
import { usePlayerHealthChange } from './usePlayerHealthChange';
import { useSpecialEffects } from '.';

export const useMonsterAttack = (
  isFightFinished: boolean,
  setIsPlayerAlive: (isAlive: boolean) => void,
  onRetaliate?: () => void,
) => {
  const { setMusic } = useAppContext();
  const { playSound, changeMusic } = useSounds(setMusic);

  const { userId } = useUser();
  const { mutate, isSuccess: isUserHit } = useUpdateUserHealthApi(userId);
  const { getFearMultiplier } = useSpecialEffects();
  const { data: userHealth } = useUserHealthApi(userId);

  const { monster } = useMonsterMarker();
  const { getPlayerHealthChange } = usePlayerHealthChange();

  const { baseAttackSpeed } = monster;

  const attackSpeed = 1000 / (getFearMultiplier() * baseAttackSpeed);

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

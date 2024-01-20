import { ItemEffect } from '@mhgo/types';
import { happensWithAChanceOf } from '@mhgo/utils';

import { DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT } from '../../../utils/consts';
import { useUser } from '../../../hooks/useUser';
import { useSettingsApi, useUserStatsApi } from '@mhgo/front';

export const useSpecialEffects = () => {
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);
  const { setting: specialEffectValues } = useSettingsApi<
    { effect: ItemEffect; value: number }[]
  >('special_effect_values');
  const {
    dodge = 0,
    retaliate = 0,
    fear = 0,
  } = (userStats?.specialEffects ?? {}) as Record<ItemEffect, number>;

  const didPlayerDodge = () => {
    const dodgeMultiplier =
      specialEffectValues?.find(entry => entry.effect === 'dodge')?.value ??
      DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT;
    const isDodge = happensWithAChanceOf(dodge * dodgeMultiplier);
    return isDodge;
  };

  const didPlayerRetaliate = () => {
    const retaliateMultiplier =
      specialEffectValues?.find(entry => entry.effect === 'retaliate')?.value ??
      DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT;
    const isRetaliate = happensWithAChanceOf(retaliate * retaliateMultiplier);
    return isRetaliate;
  };

  const getFearMultiplier = () => {
    const fearMultiplier =
      specialEffectValues?.find(entry => entry.effect === 'fear')?.value ??
      DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT;
    return (100 - fearMultiplier * fear) / 100;
  };

  return { didPlayerDodge, didPlayerRetaliate, getFearMultiplier };
};

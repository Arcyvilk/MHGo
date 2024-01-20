import { modifiers, useUserStatsApi } from '@mhgo/front';
import { happensWithAChanceOf } from '@mhgo/utils';
import { ItemEffect } from '@mhgo/types';

import { useMonsterMarker } from '../../../hooks/useMonsterMarker';
import { useUser } from '../../../hooks/useUser';
import { DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT } from '../../../utils/consts';

import s from '../FightView.module.scss';

export const usePlayerHealthChange = () => {
  const { userId } = useUser();
  const { monster } = useMonsterMarker();
  const { data: userStats } = useUserStatsApi(userId);
  const { dodge = 0 } = (userStats?.specialEffects ?? {}) as Record<
    ItemEffect,
    number
  >;

  const { level, baseDamage } = monster;
  const { defense = 0 } = userStats ?? {};

  const getPlayerHealthChange = () => {
    const isDodge = didPlayerDodge(dodge);
    const monsterDamage = baseDamage * level;
    const damageAfterMitigation = Number(
      ((monsterDamage * 100) / (100 + defense)).toFixed(2),
    );
    createDamageNumber(damageAfterMitigation, isDodge);

    return {
      playerHealthChange: isDodge ? 0 : damageAfterMitigation * -1,
    };
  };

  const createDamageNumber = (damage: number, isDodge: boolean) => {
    const particle = document.createElement('div');
    const classNames = modifiers(s, 'particle', 'playerDmg', { isDodge }).split(
      ' ',
    );
    particle.classList.add(...classNames);
    particle.innerText = isDodge ? 'Dodged' : String(damage);
    const wrapper = document.getElementById('user_health_bar');
    if (wrapper) {
      wrapper.appendChild(particle);
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  };

  return { getPlayerHealthChange };
};

const didPlayerDodge = (dodge: number) => {
  const dodgePercentage = DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT;
  const isDodge = happensWithAChanceOf(dodge * dodgePercentage);
  return isDodge;
};

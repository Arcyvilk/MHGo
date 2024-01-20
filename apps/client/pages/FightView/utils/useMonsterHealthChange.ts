import { modifiers, useUserStatsApi } from '@mhgo/front';
import { happensWithAChanceOf } from '@mhgo/utils';
import { ItemEffect } from '@mhgo/types';

import { useUser } from '../../../hooks/useUser';
import { DmgValue } from '../PlayerDPS';

import s from '../FightView.module.scss';
import { DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT } from '../../../utils/consts';
import { useMonsterMarker } from '../../../hooks/useMonsterMarker';

export const useMonsterHealthChange = () => {
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);
  const { monster } = useMonsterMarker();
  const { level, baseDamage } = monster;
  const { attack = 1, critChance = 0, critDamage = 100 } = userStats ?? {};
  const { retaliate = 0 } = (userStats?.specialEffects ?? {}) as Record<
    ItemEffect,
    number
  >;

  const getMonsterNewHP = (
    monsterHP: number,
    dmgValues: DmgValue[],
    setDmgValues: (dmgValues: DmgValue[]) => void,
  ) => {
    const userCritDamageMultiplier = 1 + critDamage / 100;
    const isCrit = happensWithAChanceOf(critChance);
    const userFinalDamage = isCrit ? attack * userCritDamageMultiplier : attack;

    const newHP = monsterHP - userFinalDamage;
    createDamageNumber(userFinalDamage, isCrit, false);
    setDmgValues([
      ...dmgValues,
      { timestamp: Date.now(), dmg: userFinalDamage },
    ]);
    return { newHP, isCrit };
  };

  const getMonsterRetaliate = (monsterHP: number) => {
    const isRetaliate = didPlayerRetaliate(retaliate);
    if (!isRetaliate) return null;
    const retaliateDamage = baseDamage * level;
    const newHP = monsterHP - retaliateDamage;
    createDamageNumber(retaliateDamage, false, true);
    return { newHP };
  };

  const createDamageNumber = (
    damage: number,
    isCrit: boolean,
    isRetaliate: boolean,
  ) => {
    const particle = document.createElement('div');
    const classNames = modifiers(s, 'particle', 'monsterDmg', {
      isCrit,
      isRetaliate,
    }).split(' ');
    // I tried making it do the numbers always follow the cursor,
    // but for some reason it greatly choked the DPS
    particle.classList.add(...classNames);
    particle.innerText = isRetaliate ? `Retaliate: ${damage}!` : String(damage);
    const wrapper = document.getElementById('monster_wrapper');
    if (wrapper) {
      wrapper.appendChild(particle);
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  };

  return { getMonsterNewHP, getMonsterRetaliate };
};

const didPlayerRetaliate = (retaliate: number) => {
  const retaliatePercentage = DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT;
  const isRetaliate = happensWithAChanceOf(retaliate * retaliatePercentage);
  return isRetaliate;
};

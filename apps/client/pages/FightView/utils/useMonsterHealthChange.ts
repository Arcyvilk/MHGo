import { modifiers, useUserStatsApi } from '@mhgo/front';
import { happensWithAChanceOf } from '@mhgo/utils';

import { useUser } from '../../../hooks/useUser';
import { useMonsterMarker } from '../../../hooks/useMonsterMarker';
import { DmgValue } from '../PlayerDPS';
import { useSpecialEffects } from '.';

import s from '../FightView.module.scss';

export const useMonsterHealthChange = () => {
  const { userId } = useUser();
  const { data: userStats } = useUserStatsApi(userId);
  const { didPlayerRetaliate } = useSpecialEffects();
  const { monster } = useMonsterMarker();
  const { level, baseDamage } = monster;
  const { attack = 1, critChance = 0, critDamage = 100 } = userStats ?? {};

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
    const isRetaliate = didPlayerRetaliate();
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
    particle.innerText = isRetaliate
      ? `Retaliate: ${damage.toFixed(2)}!`
      : damage.toFixed(2);
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

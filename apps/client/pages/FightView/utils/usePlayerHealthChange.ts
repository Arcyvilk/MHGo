import { modifiers, useUserStatsApi } from '@mhgo/front';

import { useMonsterMarker } from '../../../hooks/useMonsterMarker';
import { useUser } from '../../../hooks/useUser';
import { useSpecialEffects } from '.';

import s from '../FightView.module.scss';

export const usePlayerHealthChange = () => {
  const { userId } = useUser();
  const { monster } = useMonsterMarker();
  const { data: userStats } = useUserStatsApi(userId);
  const { didPlayerDodge } = useSpecialEffects();

  const { level, baseDamage } = monster;
  const { defense = 0 } = userStats ?? {};

  const getPlayerHealthChange = () => {
    const isDodge = didPlayerDodge();
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
    particle.innerText = isDodge ? 'Dodged' : damage.toFixed(2);
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

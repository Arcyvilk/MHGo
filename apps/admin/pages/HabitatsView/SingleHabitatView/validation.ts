import { Habitat } from '@mhgo/types';
import { toast } from 'react-toastify';

export const validateHabitat = (habitat?: Habitat) => {
  if (!habitat) return false;

  const spawnRatios = habitat.monsters.map(monster => monster.spawnChance);
  const sum = spawnRatios.reduce((a, b) => a + b, 0);

  if (sum !== 100) {
    toast.error(`All spawn chances must sum to 100%! Currently it's ${sum}%`);
    return false;
  }

  return true;
};

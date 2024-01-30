import { Habitat, HabitatMarker } from '@mhgo/types';
import { randomNumberBetween, randomizeWithinBounds } from '@mhgo/utils';

export const determineMonsterLevel = (userLevel: number) => {
  return randomNumberBetween(1, userLevel > 10 ? 5 : Math.floor(userLevel / 2));
};

export const determineMonsterSpawn = (
  habitatMarker: HabitatMarker,
  habitats: Habitat[],
  disabledMonsterIds: string[],
  userLevel: number,
) => {
  // Get marker's habitat
  const habitat = habitats.find(h => h.id === habitatMarker.habitatId);

  // Randomize monster spawning there
  const chances = habitat.monsters.map(m => ({
    id: m.id,
    chance: m.spawnChance,
  }));
  const monsterId = randomizeWithinBounds(chances);

  // Determine if monster should spawn of not
  const shouldSpawn = !disabledMonsterIds.includes(monsterId);

  // Determine level of the monster
  const monsterLevel = habitatMarker.level ?? determineMonsterLevel(userLevel);

  return { monsterId, monsterLevel, shouldSpawn };
};

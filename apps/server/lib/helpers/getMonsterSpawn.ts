import { Habitat, HabitatMarker } from '@mhgo/types';
import {
  randomNumberBetweenSeeded,
  randomizeWithinBoundsSeeded,
} from '@mhgo/utils';
import { getMarkerSeed } from './getSeed';

export const determineMonsterLevel = async (
  habitatMarker: HabitatMarker,
  userLevel: number,
  globalSeed: number,
) => {
  // Get marker's current seed
  const seed = await getMarkerSeed(habitatMarker, globalSeed);

  return randomNumberBetweenSeeded(
    1,
    userLevel > 10 ? 5 : Math.floor(userLevel / 2),
    seed,
  );
};

export const determineMonsterSpawn = async (
  habitatMarker: HabitatMarker,
  habitats: Habitat[],
  disabledMonsterIds: string[],
  userLevel: number,
  globalSeed: number,
) => {
  // Get marker's habitat
  const habitat = habitats.find(h => h.id === habitatMarker.habitatId);

  // If there is no monsters in the habitat, obviously nothing spawns
  if (habitat.monsters.length === 0) {
    return { monsterId: null, monsterLevel: null, shouldSpawn: false };
  }

  // Get marker's current seed
  const seed = await getMarkerSeed(habitatMarker, globalSeed);

  // Randomize monster spawning there
  const chances = habitat.monsters.map(m => ({
    id: m.id,
    chance: m.spawnChance,
  }));
  const monster = randomizeWithinBoundsSeeded(chances, seed);

  const monsterId = monster?.id;

  // Determine if monster should spawn of not
  const shouldSpawn = !disabledMonsterIds.includes(monsterId);

  // Determine level of the monster
  const monsterLevel =
    habitatMarker.level ??
    (await determineMonsterLevel(habitatMarker, userLevel, globalSeed));

  return { monsterId, monsterLevel, shouldSpawn };
};

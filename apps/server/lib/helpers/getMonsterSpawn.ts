import { Biome, BiomeMarker } from '@mhgo/types';
import {
  randomNumberBetweenSeeded,
  randomizeWithinBoundsSeeded,
} from '@mhgo/utils';
import { getMarkerSeed } from './getSeed';

export const determineMonsterLevel = async (
  biomeMarker: BiomeMarker,
  userLevel: number,
  globalSeed: number,
) => {
  // Get marker's current seed
  const seed = await getMarkerSeed(biomeMarker, globalSeed);

  return randomNumberBetweenSeeded(
    1,
    userLevel > 10 ? 5 : Math.floor(userLevel / 2),
    seed,
  );
};

export const determineMonsterSpawn = async (
  biomeMarker: BiomeMarker,
  biomes: Biome[],
  disabledMonsterIds: string[],
  userLevel: number,
  globalSeed: number,
) => {
  // Get marker's biome
  const biome = biomes.find(h => h.id === biomeMarker.biomeId);

  // If there is no monsters in the biome, obviously nothing spawns
  if (biome.monsters.length === 0) {
    return { monsterId: null, monsterLevel: null, shouldSpawn: false };
  }

  // Get marker's current seed
  const seed = await getMarkerSeed(biomeMarker, globalSeed);

  // Randomize monster spawning there
  const chances = biome.monsters.map(m => ({
    id: m.id,
    chance: m.spawnChance,
  }));
  const monster = randomizeWithinBoundsSeeded(chances, seed);

  const monsterId = monster?.id;

  // Determine if monster should spawn of not
  const shouldSpawn = !disabledMonsterIds.includes(monsterId);

  // Determine level of the monster
  const monsterLevel =
    biomeMarker.level ??
    (await determineMonsterLevel(biomeMarker, userLevel, globalSeed));

  return { monsterId, monsterLevel, shouldSpawn };
};

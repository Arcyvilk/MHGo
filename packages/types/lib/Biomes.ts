export type BiomeType = 'swamp' | 'desert' | 'forest' | 'cave'; // TODO deprecate this

export type Biome = {
  id: string;
  name: string;
  description: string;
  image: string;
  thumbnail: string;
  monsters: BiomeMonster[];
};

export type BiomeMonster = {
  id: string;
  spawnChance: number;
};

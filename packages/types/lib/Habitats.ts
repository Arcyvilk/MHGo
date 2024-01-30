export type HabitatType = 'swamp' | 'desert' | 'forest' | 'cave'; // TODO deprecate this

export type Habitat = {
  id: string;
  name: string;
  description: string;
  image: string;
  thumbnail: string;
  monsters: HabitatMonster[];
};

export type HabitatMonster = {
  id: string;
  spawnChance: number;
};

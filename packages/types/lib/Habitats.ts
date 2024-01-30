export type Habitat = {
  id: string;
  name: string;
  description: string;
  image: string;
  monsters: HabitatMonster[];
};

export type HabitatMonster = {
  id: string;
  spawnChance: number;
};

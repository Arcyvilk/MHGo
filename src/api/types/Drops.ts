export type Drop = {
  materialId: string; // ID of the material to drop
  chance: number; // from 0 to 100
  amount: number; // how many of those can drop
};

export type MonsterDrop = {
  monsterId: string; // ID of the monster that drops this
  drops: {
    level: number;
    drops: Drop[];
  }[];
};

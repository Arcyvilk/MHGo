export type ItemStat = {
  itemId: string;
  stats: Stats;
};

export type Stats = {
  attack?: number;
  defense?: number;
  health?: number;
  element?: string;
  luck?: number;
  critChance?: number;
  critDamage?: number;
};

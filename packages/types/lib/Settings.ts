import { Stats } from './ItemStats';

export type Setting<T> = { key: string; value: T };
export type Settings<T> = Setting<T>[];

export type BaseStats = Required<Stats>;

export type RarityFilter = {
  rarity: number;
  filter: string;
};

export type LevelUpReward = {
  level: number;
  rewards: Reward[];
};

export type Reward = { type: 'item' | 'material'; id: string; amount: number };

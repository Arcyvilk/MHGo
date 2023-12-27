export type Setting<T> = { key: string; value: T };
export type Settings<T> = Setting<T>[];

export type BaseStats = {
  attack: number;
  defense: number;
  health: number;
  element: string;
  luck: number;
  critChance: number;
  critDamage: number;
};

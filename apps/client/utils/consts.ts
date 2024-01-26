import { ItemEffect, Monster, MonsterMarker, Reward, Stats } from '@mhgo/types';

export { API_URL, CDN_URL } from '../env';

export const APP_NAME = 'Master Hoarder GO';
export const APP_VERSION = 'v0.42.67-beta'; // moved to database

export const ITEM_ID_BLOOD_BAG = 'blood_bag';

export const DEFAULT_COORDS = [0, 0];
export const DEFAULT_ZOOM = { current: 16 };
export const DEFAULT_MAP_RADIUS = 0;
export const DEFAULT_SPECIAL_EFFECT_MAX_POINTS = 5;
export const DEFAULT_SPECIAL_EFFECT_MULTIPLIER_PER_POINT = 5;
export const DEFAULT_SPECIAL_EFFECT_TYPES: ItemEffect[] = [
  'retaliate',
  'fear',
  'dodge',
];
export const DEFAULT_LEVEL_UP_REWARDS: Reward[] = [
  { type: 'item', id: 'potion', amount: 5 },
];

export const MONSTER_MISSING: Monster = {
  id: '-1',
  name: 'ERR',
  description: 'ERR',
  img: '',
  thumbnail: '',
  habitat: '',
  baseDamage: 0,
  baseAttackSpeed: 0,
  baseWealth: [],
  baseExp: 0,
  baseHP: 0,
  levelRequirements: 0,
  extinct: false,
  hideInGuide: false,
};

export const MONSTER_MARKER_MISSING: Omit<MonsterMarker, 'level'> & {
  level: number;
} = {
  id: '-1',
  monsterId: '-1',
  level: 1,
  coords: [0, 0],
  respawnTime: 999,
};

export const DEFAULT_STATS: Stats = {
  attack: 0,
  defense: 0,
  health: 0,
  element: 'null',
  luck: 0,
  critChance: 0,
  critDamage: 0,
  specialEffects: [],
};

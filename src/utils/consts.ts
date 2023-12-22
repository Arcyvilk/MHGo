import { MonsterMarker } from '../_mock/mapMarkers';
import { Monster } from '../_mock/monsters';

export const APP_NAME = 'Master Hoarder GO';
export const APP_VERSION = 'v66.6-240116-0800'; // moved to database

export const CDN_URL = 'https://cdn.arcyvilk.com/mhgo';
export const API_URL = 'https://api.mhgo.arcyvilk.com';

export const DEFAULT_COORDS = [59.892131, 10.6194067];
export const MAP_RANGE = 75; // moved to database

export const MONSTER_MISSING: Monster = {
  id: '-1',
  name: 'ERR',
  description: 'ERR',
  img: '',
  thumbnail: '',
  habitat: '',
  baseAttack: 0,
  baseCoins: 0,
  baseExp: 0,
  baseHP: 0,
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

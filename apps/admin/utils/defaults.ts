import {
  ItemSlot,
  ItemType,
  Material,
  Monster,
  MonsterMarker,
  Resource,
  ResourceMarker,
  Stats,
} from '@mhgo/types';

export const DEFAULT_COORDS = [0, 0];

export const DEFAULT_STATS: Stats = {
  attack: 0,
  defense: 0,
  health: 0,
  element: 'null',
  luck: 0,
  critChance: 0,
  critDamage: 0,
};

export const DEFAULT_MONSTER: Monster = {
  id: '',
  img: '/monsters/XXX.jpg',
  thumbnail: '/monsters/thumbnail-XXX.jpg',
  habitat: 'swamp',
  name: '',
  description: '',
  levelRequirements: 0,
  baseAttackSpeed: 0,
  baseHP: 0,
  baseDamage: 0,
  baseExp: 0,
  baseWealth: [
    {
      type: 'base',
      amount: 0,
    },
    {
      type: 'premium',
      amount: 0,
    },
  ],
};

export const DEFAULT_MATERIAL: Material = {
  id: '',
  name: '',
  description: '',
  rarity: 1,
  img: '/materials/XXX.svg',
  filter: '',
};

export const DEFAULT_RESOURCE: Resource = {
  id: '',
  name: '',
  description: '',
  img: '/resources/XXX.jpg',
  thumbnail: '/resources/thumbnail-XXX.svg',
  drops: [],
};

export const DEFAULT_MONSTER_MARKER: Omit<MonsterMarker, 'respawnTime' | 'id'> =
  {
    monsterId: '',
    level: null,
    coords: [],
  };

export const DEFAULT_RESOURCE_MARKER: Omit<
  ResourceMarker,
  'respawnTime' | 'id'
> = {
  resourceId: '',
  coords: [],
};

export const DEFAULT_ITEM_TYPES: ItemType[] = [
  'quest',
  'weapon',
  'armor',
  'other',
];

export const DEFAULT_SLOTS: ItemSlot[] = [
  'weapon',
  'helmet',
  'chest',
  'arm',
  'waist',
  'leg',
];

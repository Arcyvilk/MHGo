import { v4 as uuid } from 'uuid';
import {
  Item as TItem,
  ItemSlot,
  ItemType,
  Material,
  Monster,
  MonsterMarker,
  Resource,
  ResourceMarker,
  Stats,
  ItemEffect,
} from '@mhgo/types';

export const DEFAULT_COORDS = [0, 0];

export const DEFAULT_STATS: Stats = {
  attack: 0,
  defense: 0,
  health: 0,
  element: 'none',
  luck: 0,
  critChance: 0,
  critDamage: 0,
};

export const DEFAULT_MONSTER: Monster = {
  id: uuid(),
  img: '/monsters/XXX.jpg',
  thumbnail: '/monsters/thumbnail-XXX.jpg',
  habitat: 'swamp',
  name: '',
  description: '',
  hideInGuide: false,
  extinct: false,
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

export const DEFAULT_ITEM: TItem = {
  id: uuid(),
  type: 'other',
  slot: null,
  img: '/items/XXX.svg',
  name: '',
  description: '',
  rarity: 1,
  purchasable: false,
  craftable: false,
  craftList: [],
  equippable: false,
  usable: false,
  obtainedAt: '',
  consumable: false,
  quickUse: false,
  levelRequirement: 0,
  category: null,
};

export const DEFAULT_MATERIAL: Material = {
  id: uuid(),
  name: '',
  description: '',
  rarity: 1,
  img: '/materials/XXX.svg',
  filter: '',
};

export const DEFAULT_RESOURCE: Resource = {
  id: uuid(),
  name: '',
  description: '',
  img: '/resources/XXX.jpg',
  thumbnail: '/resources/thumbnail-XXX.svg',
  levelRequirements: 0,
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

export const DEFAULT_SPECIAL_EFFECT_TYPES: ItemEffect[] = [
  'retaliate',
  'fear',
  'dodge',
];

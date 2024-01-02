import { Material, Monster } from '@mhgo/types';

export const DEFAULT_MONSTER: Monster = {
  id: '',
  img: '/monsters/XXX.jpg',
  thumbnail: '/monsters/thumbnail-XXX.jpg',
  habitat: 'swamp',
  name: '',
  description: '',
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
  img: '/materials/XXX.jpg',
  filter: '',
};

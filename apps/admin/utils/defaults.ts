import { Monster } from '@mhgo/types';

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

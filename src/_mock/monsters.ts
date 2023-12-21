import { CDN_URL } from '../utils/consts';

export type Monster = {
  id: string;
  name: string;
  description: string;
  img: string; // URL of the fight image
  thumbnail: string; // URL of the map marker
  habitat: string;
  baseHP: number;
  baseExp: number;
  baseCoins: number;
};

export const monsters: Monster[] = [
  {
    id: 'angrybird',
    name: 'Angry Bird',
    description: 'TODO',
    img: `${CDN_URL}/monsters/angrybird.png`,
    thumbnail: `${CDN_URL}/monsters/angrybird.png`,
    habitat: 'desert',
    baseHP: 100,
    baseExp: 10,
    baseCoins: 10,
  },
  {
    id: 'babcianiath',
    name: 'Babcianiath',
    description: 'TODO',
    img: `${CDN_URL}/monsters/babcianiath.png`,
    thumbnail: `${CDN_URL}/monsters/babcianiath.png`,
    habitat: 'swamp',
    baseHP: 100,
    baseExp: 10,
    baseCoins: 10,
  },
  {
    id: 'babcioth',
    name: 'Babcioth',
    description: 'TODO',
    img: `${CDN_URL}/monsters/babcioth.png`,
    thumbnail: `${CDN_URL}/monsters/babcioth.png`,
    habitat: 'forest',
    baseHP: 100,
    baseExp: 10,
    baseCoins: 10,
  },
  {
    id: 'businessnath',
    name: 'Businessnath',
    description: 'TODO',
    img: `${CDN_URL}/monsters/businessnath.png`,
    thumbnail: `${CDN_URL}/monsters/businessnath.png`,
    habitat: 'swamp',
    baseHP: 100,
    baseExp: 10,
    baseCoins: 10,
  },
];

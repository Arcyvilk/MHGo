import { CDN_URL } from '../utils/consts';

export type Monster = {
  id: string;
  name: string;
  description: string;
  img: string; // URL of the fight image
  thumbnail: string; // URL of the map marker
  habitat: string;
  baseHP: number;
  baseAttack: number;
  baseExp: number;
  baseCoins: number;
};

export const monsters: Monster[] = [
  {
    id: 'angrybird',
    name: 'Angry Bird',
    description: 'TODO',
    img: `${CDN_URL}/monsters/angrybird.png`,
    thumbnail: `${CDN_URL}/monsters/thumbnail-angrybird.png`,
    habitat: 'desert',
    baseHP: 100,
    baseAttack: 10,
    baseExp: 10,
    baseCoins: 10,
  },
  {
    id: 'babcianiath',
    name: 'Babcianiath',
    description: 'TODO',
    img: `${CDN_URL}/monsters/babcianiath.png`,
    thumbnail: `${CDN_URL}/monsters/thumbnail-babcianiath.png`,
    habitat: 'forest',
    baseHP: 100,
    baseAttack: 10,
    baseExp: 10,
    baseCoins: 10,
  },
  // {
  //   id: 'babcioth',
  //   name: 'Babcioth',
  //   description: 'TODO',
  //   img: `${CDN_URL}/monsters/babcioth.png`,
  //   thumbnail: `${CDN_URL}/monsters/thumbnail-babcioth.png`,
  //   habitat: 'forest',
  //   baseHP: 100,
  //   baseAttack: 10,
  //   baseExp: 10,
  //   baseCoins: 10,
  // },
  {
    id: 'businessnath',
    name: 'Businessnath',
    description: 'TODO',
    img: `${CDN_URL}/monsters/businessnath.png`,
    thumbnail: `${CDN_URL}/monsters/thumbnail-businessnath.png`,
    habitat: 'swamp',
    baseHP: 100,
    baseAttack: 10,
    baseExp: 10,
    baseCoins: 10,
  },
  {
    id: 'sabertooth',
    name: 'Sabertooth',
    description: 'TODO',
    img: `${CDN_URL}/monsters/sabertooth.png`,
    thumbnail: `${CDN_URL}/monsters/thumbnail-sabertooth.png`,
    habitat: 'cave',
    baseHP: 100,
    baseAttack: 10,
    baseExp: 10,
    baseCoins: 10,
  },
  {
    id: 'dracolich',
    name: 'Dracolich',
    description: 'The Final Boss',
    img: `${CDN_URL}/monsters/dracolich.png`,
    thumbnail: `${CDN_URL}/monsters/thumbnail-dracolich.png`,
    habitat: 'cave',
    baseHP: 1000,
    baseAttack: 100,
    baseExp: 500,
    baseCoins: 500,
  },
];

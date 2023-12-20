import { CDN_URL } from '../utils/consts';

export type Item = {
  id: string;
  img: string;
  name: string;
  description: string;
  rarity: number;
  price: number;
  purchasable: boolean;
};

export const items: Item[] = [
  {
    id: 'potion',
    img: `${CDN_URL}/items/potion.jpg`,
    name: 'Potion',
    description: 'B',
    rarity: 2,
    price: 60,
    purchasable: true,
  },
  {
    id: 'bomb',
    img: `${CDN_URL}/items/barrel.jpg`,
    name: 'Barrel bomb',
    description: 'Blablablablabla',
    rarity: 5,
    price: 60,
    purchasable: true,
  },
  {
    id: 'pitfall',
    img: `${CDN_URL}/items/pitfall.jpg`,
    name: 'Pitfall trap',
    description: 'Blablablabalbal',
    rarity: 4,
    price: 60,
    purchasable: true,
  },
  {
    id: 'paintball',
    img: `${CDN_URL}/items/paintball.jpg`,
    name: 'Paintball',
    description: 'Bablablablablabalbalbal',
    rarity: 3,
    price: 9999999,
    purchasable: true,
  },
  {
    id: 'steak',
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'Well-done steak',
    description: 'Bbdbfiuewbfiur',
    rarity: 1,
    price: 60,
    purchasable: true,
  },
];

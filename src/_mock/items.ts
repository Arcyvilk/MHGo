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
    img: 'https://cdn.arcyvilk.com/mhgo/potion.jpg',
    name: 'Potion',
    description: 'B',
    rarity: 2,
    price: 60,
    purchasable: true,
  },
  {
    id: 'bomb',
    img: 'https://cdn.arcyvilk.com/mhgo/barrel.jpg',
    name: 'Barrel bomb',
    description: 'Blablablablabla',
    rarity: 5,
    price: 60,
    purchasable: true,
  },
  {
    id: 'pitfall',
    img: 'https://cdn.arcyvilk.com/mhgo/pitfall.jpg',
    name: 'Pitfall trap',
    description: 'Blablablabalbal',
    rarity: 4,
    price: 60,
    purchasable: true,
  },
  {
    id: 'paintball',
    img: 'https://cdn.arcyvilk.com/mhgo/paintball.jpg',
    name: 'Paintball',
    description: 'Bablablablablabalbalbal',
    rarity: 3,
    price: 60,
    purchasable: true,
  },
  {
    id: 'steak',
    img: 'https://cdn.arcyvilk.com/mhgo/steak.jpg',
    name: 'Well-done steak',
    description: 'Bbdbfiuewbfiur',
    rarity: 1,
    price: 60,
    purchasable: true,
  },
];

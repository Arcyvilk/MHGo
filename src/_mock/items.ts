import { CDN_URL } from '../utils/consts';

export enum ItemType {
  QUEST = 'quest',
  WEAPON = 'weapon',
  ARMOR = 'armor',
  OTHER = 'other',
}
export type CraftList = {
  id: string;
  type: 'item' | 'material';
  amount: number;
};
export type Item = {
  id: string;
  type: ItemType;
  img: string;
  name: string;
  description: string;
  rarity: number;
  price: number;
  purchasable: boolean;
  craftable: boolean;
  craftList: CraftList[];
};

export const items: Item[] = [
  {
    id: 'potion',
    type: ItemType.OTHER,
    img: `${CDN_URL}/items/potion.jpg`,
    name: 'Potion',
    description: 'B',
    rarity: 2,
    price: 60,
    purchasable: true,
    craftable: false,
    craftList: [],
  },
  {
    id: 'bomb',
    type: ItemType.OTHER,
    img: `${CDN_URL}/items/barrel.jpg`,
    name: 'Barrel bomb',
    description: 'Blablablablabla',
    rarity: 5,
    price: 60,
    purchasable: true,
    craftable: false,
    craftList: [],
  },
  {
    id: 'pitfall',
    type: ItemType.OTHER,
    img: `${CDN_URL}/items/pitfall.jpg`,
    name: 'Pitfall trap',
    description: 'Blablablabalbal',
    rarity: 4,
    price: 60,
    purchasable: true,
    craftable: false,
    craftList: [],
  },
  {
    id: 'paintball',
    type: ItemType.OTHER,
    img: `${CDN_URL}/items/paintball.jpg`,
    name: 'Paintball',
    description: 'Bablablablablabalbalbal',
    rarity: 3,
    price: 9999999,
    purchasable: true,
    craftable: false,
    craftList: [],
  },
  {
    id: 'steak',
    type: ItemType.OTHER,
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'Well-done steak',
    description: 'Bbdbfiuewbfiur',
    rarity: 1,
    price: 60,
    purchasable: true,
    craftable: false,
    craftList: [],
  },

  // QUEST
  {
    id: 'grimoire',
    type: ItemType.QUEST,
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'Grimoire',
    description: 'Bbdbfiuewbfiur',
    rarity: 5,
    price: 0,
    purchasable: false,
    craftable: true,
    craftList: [
      { id: 'page1', type: 'item', amount: 1 },
      { id: 'page2', type: 'item', amount: 1 },
      { id: 'page3', type: 'item', amount: 1 },
    ],
  },
  {
    id: 'page1',
    type: ItemType.QUEST,
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'Lost Chapter: Introduction to the Art of Looting',
    description: 'A third chapter required to complete The Grimoire.',
    rarity: 5,
    price: 0,
    purchasable: false,
    craftable: true,
    craftList: [
      { id: 'scale5', type: 'material', amount: 1 },
      { id: 'fin5', type: 'material', amount: 1 },
      { id: 'claw5', type: 'material', amount: 1 },
      { id: 'hide5', type: 'material', amount: 1 },
    ],
  },
  {
    id: 'page2',
    type: ItemType.QUEST,
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'Lost Chapter: Hoarding for Dummies',
    description: 'A third chapter required to complete The Grimoire.',
    rarity: 5,
    price: 10000,
    purchasable: true,
    craftable: false,
    craftList: [],
  },
  {
    id: 'page3',
    type: ItemType.QUEST,
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'Lost Chapter: More is More, and Less is Less',
    description: 'A third chapter required to complete The Grimoire.',
    rarity: 5,
    price: 0,
    purchasable: false,
    craftable: false,
    craftList: [],
  },
  // WEAPON
  {
    id: 'dullblade',
    type: ItemType.WEAPON,
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'Dull blade',
    description: 'A very dull blade.',
    rarity: 1,
    price: 0,
    purchasable: false,
    craftable: true,
    craftList: [
      { id: 'claw1', type: 'material', amount: 50 },
      { id: 'hide1', type: 'material', amount: 10 },
    ],
  },
  // ARMOR
  {
    id: 'bucket',
    type: ItemType.ARMOR,
    img: `${CDN_URL}/items/steak.jpg`,
    name: 'A wooden bucket',
    description: 'Not very effective as armor but it is what it is.',
    rarity: 1,
    price: 0,
    purchasable: false,
    craftable: true,
    craftList: [
      { id: 'scale1', type: 'material', amount: 10 },
      { id: 'scale2', type: 'material', amount: 5 },
      { id: 'scale3', type: 'material', amount: 2 },
      { id: 'scale4', type: 'material', amount: 1 },
    ],
  },
];

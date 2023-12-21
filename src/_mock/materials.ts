import { CDN_URL } from '../utils/consts';

export type Material = {
  id: string;
  img: string;
  name: string;
  description: string;
  rarity: number;
  price: number;
  purchasable: boolean;
  filter: string;
};

const materialsBase: Pick<Material, 'id' | 'img' | 'name'>[] = [
  {
    id: 'claw',
    img: `${CDN_URL}/materials/base_claw.webp`,
    name: 'Claw',
  },
  {
    id: 'fin',
    img: `${CDN_URL}/materials/base_default.webp`,
    name: 'Membrane',
  },
  {
    id: 'hide',
    img: `${CDN_URL}/materials/base_hide.webp`,
    name: 'Hide',
  },
  {
    id: 'scale',
    img: `${CDN_URL}/materials/base_scale.webp`,
    name: 'Scale',
  },
  {
    id: 'bug',
    img: `${CDN_URL}/materials/bug_yellow.webp`,
    name: 'Bug',
  },
];

const materialsRarity1: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}1`,
  name: `Basic ${material.name}`,
  description: `Just a common ${material.name.toLowerCase()}. You can find it everywhere.`,
  rarity: 1,
  price: 5,
  purchasable: false,
  filter: 'grayscale(100%)',
}));

const materialsRarity2: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}2`,
  name: `Quality ${material.name}`,
  description: `A common ${material.name.toLowerCase()} of marginally higher quality.`,
  rarity: 2,
  price: 25,
  purchasable: false,
  filter: 'sepia(100%) hue-rotate(75deg) brightness(90%)',
}));

const materialsRarity3: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}3`,
  name: `Rare ${material.name}`,
  description: `Woah! A rare ${material.name.toLowerCase()}! You don't see those every day.`,
  rarity: 3,
  price: 100,
  purchasable: false,
  filter: 'sepia(100%) hue-rotate(175deg) brightness(80%)',
}));

const materialsRarity4: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}4`,
  name: `Shiny ${material.name}`,
  description: `Beautiful, shiny ${material.name.toLowerCase()}. It could be a piece of jewelry if you didn't know better.`,
  rarity: 4,
  price: 250,
  purchasable: false,
  filter: 'sepia(100%) hue-rotate(1deg) brightness(120%)',
}));

const materialsRarity5: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}5`,
  name: `Devil's ${material.name}`,
  description: `Such an extraordinary luck! Everyone thought that "${material.name.toLowerCase()}" is just a children's tale!`,
  rarity: 5,
  price: 550,
  purchasable: false,
  filter: 'sepia(100%) hue-rotate(300deg) brightness(90%)',
}));

export const materials: Material[] = [
  ...materialsRarity1,
  ...materialsRarity2,
  ...materialsRarity3,
  ...materialsRarity4,
  ...materialsRarity5,
];

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

const materialsBase: Pick<Material, 'id' | 'img' | 'description' | 'name'>[] = [
  {
    id: 'claw',
    img: `${CDN_URL}/materials/base_claw.webp`,
    name: 'Claw',
    description: 'B',
  },
  {
    id: 'fin',
    img: `${CDN_URL}/materials/base_claw.webp`,
    name: 'Fin',
    description: 'B',
  },
  {
    id: 'hide',
    img: `${CDN_URL}/materials/base_hide.webp`,
    name: 'Hide',
    description: 'B',
  },
  {
    id: 'scale',
    img: `${CDN_URL}/materials/base_scale.webp`,
    name: 'Scale',
    description: 'B',
  },
  {
    id: 'bug',
    img: `${CDN_URL}/materials/bug_yellow.webp`,
    name: 'Bug',
    description: 'B',
  },
];

const materialsRarity1: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}1`,
  name: `Basic ${material.name}`,
  rarity: 1,
  price: 5,
  purchasable: false,
  filter: 'grayscale(100%)',
}));

const materialsRarity2: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}2`,
  name: `Quality ${material.name}`,
  rarity: 2,
  price: 25,
  purchasable: false,
  filter: 'sepia(100%) hue-rotate(75deg) brightness(90%)',
}));

const materialsRarity3: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}3`,
  name: `Rare ${material.name}`,
  rarity: 3,
  price: 100,
  purchasable: false,
  filter: 'sepia(100%) hue-rotate(175deg) brightness(80%)',
}));

const materialsRarity4: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}4`,
  name: `Shiny ${material.name}`,
  rarity: 4,
  price: 250,
  purchasable: false,
  filter: 'sepia(100%) hue-rotate(1deg) brightness(120%)',
}));

const materialsRarity5: Material[] = materialsBase.map(material => ({
  ...material,
  id: `${material.id}5`,
  name: `Devil's ${material.name}`,
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

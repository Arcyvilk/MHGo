import { FieldByRarity, Material } from '../api/types/Materials';

import { CDN_URL } from '../utils/consts';

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

const fieldsByRarity: FieldByRarity[] = [
  {
    rarity: 1,
    prefix: 'Basic',
    filter: 'grayscale(100%)',
    description: 'Just a common %. You can find it everywhere.',
  },
  {
    rarity: 2,
    prefix: 'Quality',
    filter: 'sepia(100%) hue-rotate(75deg) brightness(90%)',
    description: 'A common % of marginally higher quality.',
  },
  {
    rarity: 3,
    prefix: 'Rare',
    filter: 'sepia(100%) hue-rotate(175deg) brightness(80%)',
    description: "Woah! A rare %! You don't see those every day.",
  },
  {
    rarity: 4,
    prefix: 'Shiny',
    filter: 'sepia(100%) hue-rotate(1deg) brightness(120%)',
    description:
      "Beautiful, shiny %. It could be a piece of jewelry if you didn't know better.",
  },
  {
    rarity: 5,
    prefix: "Devil's",
    filter: 'sepia(100%) hue-rotate(300deg) brightness(90%)',
    description:
      "Such an extraordinary luck! Everyone thought that % is just a children's tale!",
  },
];

const rarityList = [1, 2, 3, 4, 5];

export const materials = rarityList
  .map(rarity =>
    materialsBase.map(material => {
      const fieldByRarity =
        fieldsByRarity.find(field => field.rarity === rarity) ??
        fieldsByRarity[0];
      return {
        ...material,
        id: `${material.id}${rarity}`,
        name: `${fieldByRarity.prefix} ${material.name}`,
        filter: fieldByRarity.filter,
        description: fieldByRarity.description.replace('%', material.name),
      };
    }),
  )
  .flat();

import { Habitat } from '../api/types/Habitats';
import { CDN_URL } from '../utils/consts';

export const habitats: Habitat[] = [
  {
    id: 'swamp',
    type: 'swamp',
    name: 'Swamp',
    description: "It's a swamp.",
    image: `${CDN_URL}/habitats/swamp.jpg`,
  },
  {
    id: 'desert',
    type: 'desert',
    name: 'Desert',
    description: "It's a desert.",
    image: `${CDN_URL}/habitats/desert.jpg`,
  },
  {
    id: 'forest',
    type: 'forest',
    name: 'Forest',
    description: "It's a forest.",
    image: `${CDN_URL}/habitats/forest.jpg`,
  },
  {
    id: 'cave',
    type: 'cave',
    name: 'Cave',
    description: "It's a cave.",
    image: `${CDN_URL}/habitats/cave.jpg`,
  },
];

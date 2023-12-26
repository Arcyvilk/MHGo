import { CDN_URL } from '../utils/consts';

export type Resource = {
  id: string;
  name: string;
  description: string;
  img: string; // URL of the tap image
  thumbnail: string; // URL of the map marker
  habitat: string;
};

export const resources: Resource[] = [
  {
    id: 'tree',
    name: 'Tree',
    description: 'TODO',
    img: `${CDN_URL}/resources/angrybird.png`,
    thumbnail: `${CDN_URL}/resources/angrybird.png`,
    habitat: 'Fornebu',
  },
];

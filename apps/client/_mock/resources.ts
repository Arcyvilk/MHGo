import { addCdnUrl } from '../utils/addCdnUrl';

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
    img: addCdnUrl('/resources/angrybird.png'),
    thumbnail: addCdnUrl('/resources/angrybird.png'),
    habitat: 'Fornebu',
  },
];

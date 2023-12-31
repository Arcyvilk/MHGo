import { CDN_URL } from '../env';

export const addCdnUrl = (url: string) => {
  return `${CDN_URL}${url}`;
};

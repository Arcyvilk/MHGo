import { LSKeys } from '..';
import { CDN_URL } from '../env';

export const addCdnUrl = (url: string) => {
  const key = localStorage?.[LSKeys.MHGO_CACHE_ID] ?? '{}';
  const lsCache = JSON.parse(key);
  const newUrl =
    `${CDN_URL}${url}` + (lsCache?.id ? `?cacheId=${lsCache.id}` : '');
  return newUrl;
};

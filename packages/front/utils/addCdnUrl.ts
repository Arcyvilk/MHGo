import { LSKeys } from '..';
import { CDN_URL } from '../env';

// Adding cacheId to the URL allows us to have more control over
// caching an image. We will reuse cached images when the cacheId
// is the same, and when we want to refetch everything, we can just
// set a new cache ID!
export const addCdnUrl = (url: string) => {
  const key = localStorage?.[LSKeys.MHGO_CACHE_ID] ?? '{}';
  const lsCache = JSON.parse(key);
  const newUrl =
    `${CDN_URL}${url}` + (lsCache?.id ? `?cacheId=${lsCache.id}` : '');
  return newUrl;
};

export const removeCdnUrl = (url?: string | null) => {
  if (!url) return '';
  return url.replace(CDN_URL, '') ?? '';
};

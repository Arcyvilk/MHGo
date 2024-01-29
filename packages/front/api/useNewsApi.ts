import { useSuspenseQuery } from '@tanstack/react-query';
import { News } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl } from '../utils/addCdnUrl';
import { fetcher } from '..';

/**
 *
 * @returns
 */
export const useNewsApi = () => {
  const getNews = async (): Promise<News[]> => {
    const res = await fetcher(`${API_URL}/news/list`);
    return res.json();
  };

  const {
    data: news = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<News[], unknown, News[], string[]>({
    queryKey: ['news'],
    queryFn: getNews,
  });

  const data = news.map(post => ({
    ...post,
    img: addCdnUrl(post.img),
  }));

  return { data, isLoading, isFetched, isError };
};

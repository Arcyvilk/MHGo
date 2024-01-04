import { useQuery } from '@tanstack/react-query';
import { News } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl } from '../utils/addCdnUrl';

/**
 *
 * @returns
 */
export const useNewsApi = () => {
  const getNews = async (): Promise<News[]> => {
    const res = await fetch(`${API_URL}/news/list`);
    return res.json();
  };

  const {
    data: news = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<News[], unknown, News[], string[]>({
    queryKey: ['news'],
    queryFn: getNews,
    staleTime: Infinity,
  });

  const data = news.map(post => ({
    ...post,
    img: addCdnUrl(post.img),
  }));

  return { data, isLoading, isFetched, isError };
};

import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../utils/consts';
import { News } from './types/News';

/**
 *
 * @returns
 */
export const useNews = () => {
  const getNews = async (): Promise<News[]> => {
    const res = await fetch(`${API_URL}/news/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<News[], unknown, News[], string[]>({
    queryKey: ['news'],
    queryFn: getNews,
  });

  return { data, isLoading, isFetched, isError };
};

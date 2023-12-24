import { useQuery } from '@tanstack/react-query';
import { API_URL, CDN_URL } from '../utils/consts';
import { News } from './types/News';

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
  });

  const data = news.map(post => ({
    ...post,
    img: `${CDN_URL}${post.img}`,
  }));

  return { data, isLoading, isFetched, isError };
};

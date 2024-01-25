import { useQuery } from '@tanstack/react-query';

import { API_URL } from '../env';
import { fetcher } from '..';

export const usePrefetchAllImagesApi = (isLoggedIn: boolean) => {
  const getAllImageUrls = async (): Promise<string[]> => {
    const res = await fetcher(`${API_URL}/misc/prefetch/images`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<string[], unknown, string[], string[]>({
    queryKey: ['prefetch'],
    queryFn: getAllImageUrls,
    enabled: isLoggedIn,
  });

  return { data, isLoading, isFetched, isError };
};

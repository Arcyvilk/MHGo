import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { API_URL } from '../env';
import { fetcher } from '..';
import { Adventure } from '@mhgo/types';

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

export const useAdventuresApi = () => {
  const getAdventures = async (): Promise<Adventure[]> => {
    const res = await fetcher(`${API_URL}/misc/adventures`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Adventure[], unknown, Adventure[], string[]>({
    queryKey: ['adventures'],
    queryFn: getAdventures,
  });

  return { data, isLoading, isFetched, isError };
};

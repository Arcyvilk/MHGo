import { useSuspenseQuery } from '@tanstack/react-query';
import { Habitat } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

/**
 *
 * @returns
 */
export const useHabitatsApi = () => {
  const getHabitats = async (): Promise<Habitat[]> => {
    const res = await fetcher(`${API_URL}/habitats/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Habitat[], unknown, Habitat[], string[]>({
    queryKey: ['habitats'],
    queryFn: getHabitats,
    staleTime: Infinity,
  });

  return { data, isLoading, isFetched, isError };
};

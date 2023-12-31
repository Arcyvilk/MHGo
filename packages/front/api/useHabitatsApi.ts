import { useQuery } from '@tanstack/react-query';
import { Habitat } from '@mhgo/types';

import { API_URL } from '../env';

/**
 *
 * @returns
 */
export const useHabitatsApi = () => {
  const getHabitats = async (): Promise<Habitat[]> => {
    const res = await fetch(`${API_URL}/habitats/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Habitat[], unknown, Habitat[], string[]>({
    queryKey: ['habitats'],
    queryFn: getHabitats,
    staleTime: Infinity,
  });

  return { data, isLoading, isFetched, isError };
};

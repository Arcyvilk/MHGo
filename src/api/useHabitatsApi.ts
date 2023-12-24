import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../utils/consts';
import { Habitat } from './types';

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
  });

  return { data, isLoading, isFetched, isError };
};

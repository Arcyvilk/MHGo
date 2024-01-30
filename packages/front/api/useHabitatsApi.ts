import { useSuspenseQuery } from '@tanstack/react-query';
import { Habitat } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl, fetcher } from '..';

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
    data: habitats = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Habitat[], unknown, Habitat[], string[]>({
    queryKey: ['habitats'],
    queryFn: getHabitats,
  });

  const data = habitats.map(habitat => ({
    ...habitat,
    image: addCdnUrl(habitat.image),
  }));

  return { data, isLoading, isFetched, isError };
};

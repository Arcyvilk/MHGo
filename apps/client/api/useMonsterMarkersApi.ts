import { useQuery } from '@tanstack/react-query';
import { MonsterMarker } from '@mhgo/types';

import { API_URL } from '../utils/consts';

/**
 *
 * @returns
 */
export const useMonsterMarkersApi = (userId: string) => {
  const getMonsterMarkers = async (): Promise<MonsterMarker[]> => {
    const res = await fetch(`${API_URL}/map/monsters/user/${userId}`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<MonsterMarker[], unknown, MonsterMarker[], string[]>({
    queryKey: ['monster', 'markers', userId],
    queryFn: getMonsterMarkers,
  });

  return { data, isLoading, isFetched, isError };
};

import { useQuery } from '@tanstack/react-query';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';

import { API_URL } from '../env';

export const useMonsterMarkersApi = (userId?: string) => {
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
    queryKey: ['monster', 'markers', userId!],
    queryFn: getMonsterMarkers,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useAllResourceMarkersApi = () => {
  const getResourceMarkers = async (): Promise<ResourceMarker[]> => {
    const res = await fetch(`${API_URL}/map/markers/resources/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<ResourceMarker[], unknown, ResourceMarker[], string[]>({
    queryKey: ['markers', 'resource'],
    queryFn: getResourceMarkers,
  });

  return { data, isLoading, isFetched, isError };
};

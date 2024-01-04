import { useQuery, useMutation } from '@tanstack/react-query';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';

import { API_URL } from '../env';

export const useSingleMonsterMarkerApi = (markerId: string | null) => {
  const getMonsterMarker = async (): Promise<MonsterMarker> => {
    const res = await fetch(`${API_URL}/map/markers/monsters/${markerId}`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    MonsterMarker,
    unknown,
    MonsterMarker,
    string[]
  >({
    queryKey: ['markers', 'monster', markerId!],
    queryFn: getMonsterMarker,
    enabled: Boolean(markerId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useMonsterMarkersApi = (userId?: string, coords?: number[]) => {
  const getAllMonsterMarkers = async (): Promise<MonsterMarker[]> => {
    const res = await fetch(`${API_URL}/map/monsters/user/${userId}`, {
      method: 'POST',
      body: coords ? JSON.stringify(coords) : null,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  };

  const {
    data = [],
    mutate,
    status,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ['monster', 'markers', userId!, JSON.stringify(coords)],
    mutationFn: getAllMonsterMarkers,
  });

  return {
    data,
    mutate,
    status,
    isLoading: isPending,
    isFetched: isSuccess,
    isError,
  };
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
    queryKey: ['markers', 'resource', 'all'],
    queryFn: getResourceMarkers,
  });

  return { data, isLoading, isFetched, isError };
};

import { useQuery } from '@tanstack/react-query';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

export const useSingleMonsterMarkerApi = (markerId: string | null) => {
  const getMonsterMarker = async (): Promise<MonsterMarker> => {
    const res = await fetcher(`${API_URL}/map/markers/monsters/${markerId}`);
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
  const lat = coords?.[0] ?? null;
  const lng = coords?.[1] ?? null;

  const getAllMonsterMarkers = async (): Promise<MonsterMarker[]> => {
    const path = `${API_URL}/map/monsters/user/${userId}?lat=${lat}&lng=${lng}`;
    const res = await fetcher(path);
    return res.json();
  };

  const {
    data = [],
    status,
    isLoading,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['monster', 'markers', userId!, lat, lng],
    queryFn: getAllMonsterMarkers,
  });

  return {
    data,
    status,
    isLoading,
    isFetched,
    isError,
  };
};

export const useAllResourceMarkersApi = () => {
  const getResourceMarkers = async (): Promise<ResourceMarker[]> => {
    const res = await fetcher(`${API_URL}/map/markers/resources/list`);
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

export const useResourceMarkersApi = (userId?: string, coords?: number[]) => {
  const lat = coords?.[0] ?? null;
  const lng = coords?.[1] ?? null;

  const getAllResourceMarkers = async (): Promise<ResourceMarker[]> => {
    const path = `${API_URL}/map/resources/user/${userId}?lat=${lat}&lng=${lng}`;
    const res = await fetcher(path);
    return res.json();
  };

  const {
    data = [],
    status,
    isLoading,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['resource', 'markers', userId!, lat, lng],
    queryFn: getAllResourceMarkers,
  });

  return {
    data,
    status,
    isLoading,
    isFetched,
    isError,
  };
};

import { useSuspenseQuery } from '@tanstack/react-query';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';

import { API_URL } from '../env';
import { LSKeys, fetcher, useLocalStorage } from '..';

export const useSingleMonsterMarkerApi = (
  markerId: string | null,
  isTutorial?: boolean,
  isDummy?: boolean,
) => {
  const [homePosition] = useLocalStorage<{
    home: number[];
  }>(LSKeys.MHGO_HOME_POSITION, {
    home: [0, 0],
  });

  const getMonsterMarker = async (): Promise<MonsterMarker> => {
    if (isTutorial)
      return {
        id: 'tutorial',
        monsterId: 'tutorial',
        coords: [0, 0],
        level: null,
      };
    if (isDummy)
      return {
        id: 'dummy',
        monsterId: 'dummy',
        coords: homePosition.home,
        level: null,
      };

    const res = await fetcher(`${API_URL}/map/markers/monsters/${markerId}`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useSuspenseQuery<
    MonsterMarker,
    unknown,
    MonsterMarker,
    string[]
  >({
    queryKey: ['markers', 'monster', markerId!],
    queryFn: getMonsterMarker,
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
  } = useSuspenseQuery({
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
  } = useSuspenseQuery({
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

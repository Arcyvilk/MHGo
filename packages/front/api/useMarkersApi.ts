import { useSuspenseQuery } from '@tanstack/react-query';
import { MonsterMarker, ResourceMarker } from '@mhgo/types';

import { API_URL } from '../env';
import { LSKeys, fetcher, useLocalStorage } from '..';

export const useMonsterMarkersApi = (userId?: string, coords?: number[]) => {
  // We make coords less precise so we don't refetch every second
  const fixedCoords = coords
    ? [Number(coords[0].toFixed(2)), Number(coords[1].toFixed(2))]
    : undefined;

  const lat = fixedCoords?.[0] ?? null;
  const lng = fixedCoords?.[1] ?? null;

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

  const getMonsterMarker = async (): Promise<Omit<MonsterMarker, '_id'>> => {
    if (isTutorial)
      return {
        id: 'tutorial',
        monsterId: 'tutorial',
        habitatId: 'tutorial',
        coords: [0, 0],
        level: null,
      };
    if (isDummy)
      return {
        id: 'dummy',
        monsterId: 'dummy',
        habitatId: 'dummy',
        coords: homePosition.home,
        level: null,
      };

    const res = await fetcher(`${API_URL}/map/markers/monsters/${markerId}`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useSuspenseQuery<
    Omit<MonsterMarker, '_id'>,
    unknown,
    Omit<MonsterMarker, '_id'>,
    string[]
  >({
    queryKey: ['markers', 'monster', markerId!],
    queryFn: getMonsterMarker,
  });

  return { data, isLoading, isFetched, isError };
};

export const useResourceMarkersApi = (userId?: string, coords?: number[]) => {
  // We make coords less precise so we don't refetch every second
  const fixedCoords = coords
    ? [Number(coords[0].toFixed(2)), Number(coords[1].toFixed(2))]
    : undefined;
  const lat = fixedCoords?.[0] ?? null;
  const lng = fixedCoords?.[1] ?? null;

  const getResourceMarkers = async (): Promise<ResourceMarker[]> => {
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
    queryFn: getResourceMarkers,
  });

  return {
    data,
    status,
    isLoading,
    isFetched,
    isError,
  };
};

export const useSingleResourceMarkerApi = (markerId: string | null) => {
  const getResourceMarker = async (): Promise<ResourceMarker> => {
    const res = await fetcher(`${API_URL}/map/markers/resources/${markerId}`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useSuspenseQuery<
    ResourceMarker,
    unknown,
    ResourceMarker,
    string[]
  >({
    queryKey: ['markers', 'resource', markerId!],
    queryFn: getResourceMarker,
  });

  return { data, isLoading, isFetched, isError };
};

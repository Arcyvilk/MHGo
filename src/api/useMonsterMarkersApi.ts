import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { API_URL } from '../utils/consts';
import { MonsterMarker } from './types';
import { determineMonsterLevel } from '../utils/determineMonsterLevel';

/**
 *
 * @returns
 */
export const useMonsterMarkersApi = (userId: string, userLevel: number) => {
  const getMonsterMarkers = async (): Promise<MonsterMarker[]> => {
    const res = await fetch(`${API_URL}/map/monsters/user/${userId}`);
    return res.json();
  };

  const {
    data: monsterMarkers = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<MonsterMarker[], unknown, MonsterMarker[], string[]>({
    queryKey: ['monster', 'markers'],
    queryFn: getMonsterMarkers,
  });

  // TODO Move that to backend
  const data = useMemo(
    () =>
      monsterMarkers.map(monsterMarker => ({
        ...monsterMarker,
        level: monsterMarker.level ?? determineMonsterLevel(userLevel),
      })),
    [monsterMarkers],
  );

  return { data, isLoading, isFetched, isError };
};

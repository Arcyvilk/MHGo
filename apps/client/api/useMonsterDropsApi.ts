import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../utils/consts';
import { MonsterDrop } from './types';

/**
 *
 * @returns
 */
export const useMonsterDropsApi = () => {
  const getMonsterMarkers = async (): Promise<MonsterDrop[]> => {
    const res = await fetch(`${API_URL}/drops/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<MonsterDrop[], unknown, MonsterDrop[], string[]>({
    queryKey: ['monster', 'drops'],
    queryFn: getMonsterMarkers,
  });

  return { data, isLoading, isFetched, isError };
};

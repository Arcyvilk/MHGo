import { MonsterMarker } from '@mhgo/types';
import { API_URL } from '../../env';
import { useQuery } from '@tanstack/react-query';

export const useAdminAllMonsterMarkers = () => {
  const getAllMonsterMarkers = async (): Promise<MonsterMarker[]> => {
    const res = await fetch(`${API_URL}/map/markers/monsters/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<MonsterMarker[], unknown, MonsterMarker[], string[]>({
    queryKey: ['markers', 'monsters', 'all'],
    queryFn: getAllMonsterMarkers,
  });

  return { data, isLoading, isFetched, isError };
};

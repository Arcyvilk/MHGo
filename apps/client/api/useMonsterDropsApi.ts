import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Material, MonsterDrop } from '@mhgo/types';

import { API_URL } from '../utils/consts';

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

export const useMonsterMarkerDropsApi = (userId: string) => {
  const queryClient = useQueryClient();

  const getDropsForUser = async (variables: {
    markerId: string;
    monsterLevel?: number;
  }): Promise<Material[]> => {
    const res = await fetch(`${API_URL}/drops/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    queryClient.invalidateQueries({ queryKey: ['user', userId, 'materials'] });
    return res.json();
  };

  const { data, mutate, isSuccess, status } = useMutation({
    mutationKey: ['drops', 'user', userId],
    mutationFn: getDropsForUser,
  });

  return { data, mutate, isSuccess, status };
};

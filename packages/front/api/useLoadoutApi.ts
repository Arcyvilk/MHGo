import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loadout } from '@mhgo/types';

import { API_URL } from '../env';

export const useUserLoadoutApi = (userId: string) => {
  const getUserLoadout = async (): Promise<Loadout[]> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/loadout/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Loadout[], unknown, Loadout[], string[]>({
    queryKey: ['user', userId, 'loadout'],
    queryFn: getUserLoadout,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserEquipItemApi = (userId: string, itemId: string) => {
  const queryClient = useQueryClient();

  const getEquipItem = async (): Promise<void> => {
    await fetch(`${API_URL}/users/user/${userId}/item/${itemId}/equip`);
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'loadout'] });
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'stats'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'equip', itemId],
    mutationFn: getEquipItem,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

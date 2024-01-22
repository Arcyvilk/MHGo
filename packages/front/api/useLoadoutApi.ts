import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Loadout } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

export const useUserLoadoutApi = (userId: string) => {
  const getUserLoadout = async (): Promise<Loadout[]> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}/loadout/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Loadout[], unknown, Loadout[], string[]>({
    queryKey: ['user', userId, 'loadout'],
    queryFn: getUserLoadout,
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserEquipItemApi = (userId: string, itemId: string) => {
  const queryClient = useQueryClient();

  const getEquipItem = async ({
    action,
  }: {
    action: 'equip' | 'unequip';
  }): Promise<void> => {
    await fetcher(
      `${API_URL}/users/user/${userId}/item/${itemId}/equip?action=${action}`,
    );
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'loadout'] });
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'stats'] });
    queryClient.invalidateQueries({
      queryKey: ['user', userId, 'health', 'get'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'equip', itemId],
    mutationFn: getEquipItem,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

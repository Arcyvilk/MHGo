import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Material, Resource } from '@mhgo/types';

import { API_URL } from '../env';

export const useResourceDropsApi = () => {
  const getResourceDrops = async (): Promise<Resource[]> => {
    const res = await fetch(`${API_URL}/drops/resource/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Resource[], unknown, Resource[], string[]>({
    queryKey: ['drops', 'resource'],
    queryFn: getResourceDrops,
  });

  return { data, isLoading, isFetched, isError };
};

export const useResourceMarkerDropsApi = (userId: string) => {
  const queryClient = useQueryClient();

  const getDropsForUser = async (variables: {
    markerId: string;
  }): Promise<Material[]> => {
    const res = await fetch(`${API_URL}/drops/resource/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    queryClient.invalidateQueries({ queryKey: ['user', userId], exact: false });
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
    // This refreshes the markers on the map when they go on cooldown
    queryClient.invalidateQueries({
      queryKey: ['resource', 'markers'],
      exact: false,
    });
    return res.json();
  };

  const {
    data = [],
    mutate,
    isSuccess,
    isPending,
    status,
  } = useMutation({
    mutationKey: ['drops', 'resource', 'user', userId],
    mutationFn: getDropsForUser,
  });

  return { data, mutate, isSuccess, isPending, status };
};

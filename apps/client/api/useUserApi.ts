import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stats, User, UserAmount } from '@mhgo/types';

import { API_URL } from '../utils/consts';

export const useUserApi = (userId: string) => {
  const getUser = async (): Promise<User> => {
    const res = await fetch(`${API_URL}/users/user/${userId}`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    User,
    unknown,
    User,
    string[]
  >({
    queryKey: ['user', userId],
    queryFn: getUser,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserItemsApi = (userId: string) => {
  const getUserItems = async (): Promise<UserAmount[]> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/items/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<UserAmount[], unknown, UserAmount[], string[]>({
    queryKey: ['user', userId, 'items'],
    queryFn: getUserItems,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserMaterialsApi = (userId: string) => {
  const getUserMaterials = async (): Promise<UserAmount[]> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/materials/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<UserAmount[], unknown, UserAmount[], string[]>({
    queryKey: ['user', userId, 'materials'],
    queryFn: getUserMaterials,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserWealthApi = (userId: string) => {
  const getUserWealth = async (): Promise<UserAmount[]> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/wealth/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<UserAmount[], unknown, UserAmount[], string[]>({
    queryKey: ['user', userId, 'wealth'],
    queryFn: getUserWealth,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserStatsApi = (userId: string) => {
  const getUserStats = async (): Promise<Stats> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/stats`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    Stats,
    unknown,
    Stats,
    string[]
  >({
    queryKey: ['user', userId, 'stats'],
    queryFn: getUserStats,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUpdateUserHealth = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserHealth = async (variables: {
    healthChange: number;
  }): Promise<void> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/health`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'stats'] });

    return res.json();
  };

  const { data, mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'health'],
    mutationFn: updateUserHealth,
  });

  return { data, mutate, status, isPending, isSuccess, isError };
};

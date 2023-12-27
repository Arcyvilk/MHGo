import { useQuery } from '@tanstack/react-query';
import { Loadout, Stats, User, UserAmount } from '@mhgo/types';

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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loadout, User, UserAmount } from '@mhgo/types';

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
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserPutMaterialsApi = (userId: string) => {
  const queryClient = useQueryClient();

  const putUserMaterials = async (variables: UserAmount[]): Promise<void> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/materials`, {
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

  const { mutate, isSuccess, status } = useMutation({
    mutationKey: ['user', userId, 'materials', 'put'],
    mutationFn: putUserMaterials,
  });

  return { mutate, isSuccess, status };
};

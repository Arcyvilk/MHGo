import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CurrencyType, ItemToUse, Stats, User, UserAmount } from '@mhgo/types';

import { API_URL } from '../env';

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

type UserHealth = { maxHealth: number; currentHealth: number };
export const useUserHealthApi = (userId: string) => {
  const getUserHealth = async (): Promise<UserHealth> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/health`);
    return res.json();
  };

  const {
    data = { currentHealth: 1, maxHealth: 1 },
    isLoading,
    isFetched,
    isError,
  } = useQuery<UserHealth, unknown, UserHealth, string[]>({
    queryKey: ['user', userId, 'health', 'get'],
    queryFn: getUserHealth,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUpdateUserHealth = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserHealth = async (variables: {
    healthChange: number;
  }): Promise<void> => {
    await fetch(`${API_URL}/users/user/${userId}/health`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({
      queryKey: ['user', userId, 'health', 'get'],
    });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'health', 'update'],
    mutationFn: updateUserHealth,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

export const useUpdateUserExp = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserExp = async (variables: {
    expChange: number;
  }): Promise<void> => {
    await fetch(`${API_URL}/users/user/${userId}/exp`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({
      queryKey: ['user', userId],
    });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'exp', 'update'],
    mutationFn: updateUserExp,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

export const useUpdateUserWealth = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserWealth = async (variables: {
    [key in CurrencyType]?: number;
  }): Promise<void> => {
    await fetch(`${API_URL}/users/user/${userId}/wealth`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({
      queryKey: ['user', userId, 'wealth'],
    });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'wealth', 'update'],
    mutationFn: updateUserWealth,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

export const useUserConsumeItemsApi = (userId: string) => {
  const queryClient = useQueryClient();

  const consumeItems = async (variables: ItemToUse[]): Promise<void> => {
    await fetch(`${API_URL}/users/user/${userId}/consume`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({
      queryKey: ['user', userId, 'items'],
    });
  };

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'consume'],
    mutationFn: consumeItems,
  });

  return { mutate, isPending, isSuccess, isError };
};

export const useUserCraftItemApi = (userId: string, itemId: string) => {
  const queryClient = useQueryClient();

  const craftItems = async (variables: { amount: number }): Promise<void> => {
    await fetch(`${API_URL}/users/user/${userId}/craft/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'items'] });
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'materials'] });
    queryClient.invalidateQueries({ queryKey: ['items', itemId, 'craftList'] });
  };

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'craft', itemId],
    mutationFn: craftItems,
  });

  return { mutate, isPending, isSuccess, isError };
};

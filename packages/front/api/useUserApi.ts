import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CurrencyType,
  ItemToUse,
  Stats,
  User,
  UserAchievement,
  UserAmount,
} from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

export const useUserApi = (userId: string | null | undefined) => {
  const getUser = async (): Promise<User> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    User,
    unknown,
    User,
    string[]
  >({
    queryKey: ['user', userId!],
    queryFn: getUser,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserItemsApi = (userId: string) => {
  const getUserItems = async (): Promise<UserAmount[]> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}/items/list`);
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
    const res = await fetcher(`${API_URL}/users/user/${userId}/materials/list`);
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

export const useUserAchievementsApi = (userId: string) => {
  const getUserAchievements = async (): Promise<UserAchievement[]> => {
    const res = await fetcher(
      `${API_URL}/users/user/${userId}/achievements/list`,
    );
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<UserAchievement[], unknown, UserAchievement[], string[]>({
    queryKey: ['user', userId, 'achievements'],
    queryFn: getUserAchievements,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserWealthApi = (userId: string) => {
  const getUserWealth = async (): Promise<UserAmount[]> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}/wealth/list`);
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
    const res = await fetcher(`${API_URL}/users/user/${userId}/stats`);
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
    const res = await fetcher(`${API_URL}/users/user/${userId}/health`);
    return res.json();
  };

  const {
    data: health = { currentHealth: 1, maxHealth: 1 },
    isLoading,
    isFetched,
    isError,
  } = useQuery<UserHealth, unknown, UserHealth, string[]>({
    queryKey: ['user', userId, 'health', 'get'],
    queryFn: getUserHealth,
    enabled: Boolean(userId),
  });

  const data = {
    ...health,
    roundCurrentHealth: Math.round(health.currentHealth),
  };

  return { data, isLoading, isFetched, isError };
};

export const useUpdateUserHealthApi = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserHealth = async (variables: {
    healthChange: number;
  }): Promise<void> => {
    await fetcher(`${API_URL}/users/user/${userId}/health`, {
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

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'health', 'update'],
    mutationFn: updateUserHealth,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export type LevelUpdate = {
  oldExp: number;
  newExp: number;
  oldLevel: number;
  newLevel: number;
};
export const useUpdateUserExpApi = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserExp = async (variables: {
    expChange: number;
  }): Promise<LevelUpdate> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}/exp`, {
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
    return res.json();
  };

  const { mutate, data, error, status, isPending, isSuccess, isError } =
    useMutation({
      mutationKey: ['user', userId, 'exp', 'update'],
      mutationFn: updateUserExp,
      onSuccess: data => {
        if (data.newLevel > data.oldLevel)
          queryClient.invalidateQueries({
            queryKey: ['monster', 'markers'],
            exact: false,
          });
      },
    });

  return { mutate, data, error, status, isPending, isSuccess, isError };
};

export const useUpdateUserWealthApi = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserWealth = async (variables: {
    [key in CurrencyType]?: number;
  }): Promise<void> => {
    await fetcher(`${API_URL}/users/user/${userId}/wealth`, {
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

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'wealth', 'update'],
    mutationFn: updateUserWealth,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useUserConsumeItemsApi = (userId: string) => {
  const queryClient = useQueryClient();

  const consumeItems = async (variables: ItemToUse[]): Promise<void> => {
    await fetcher(`${API_URL}/users/user/${userId}/consume`, {
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
    await fetcher(`${API_URL}/users/user/${userId}/craft/${itemId}`, {
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
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'craft', itemId],
    mutationFn: craftItems,
  });

  return { mutate, isPending, isSuccess, isError };
};

export const useUserPurchaseItemApi = (userId: string, itemId: string) => {
  const queryClient = useQueryClient();

  const purchaseItems = async (variables: {
    amount: number;
  }): Promise<void> => {
    await fetcher(`${API_URL}/users/user/${userId}/purchase/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'items'] });
    queryClient.invalidateQueries({ queryKey: ['user', userId, 'wealth'] });
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'purchase', itemId],
    mutationFn: purchaseItems,
  });

  return { mutate, isPending, isSuccess, isError };
};

export const useUserUpdateAchievementApi = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserAchievement = async (
    variables: Pick<UserAchievement, 'achievementId' | 'progress'> & {
      newValue?: number;
    },
  ): Promise<UserAchievement> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}/achievement`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({
      queryKey: ['user', userId, 'achievements'],
    });

    return res.json();
  };

  const { mutate, data, error, status, isPending, isSuccess, isError } =
    useMutation({
      mutationKey: ['user', userId, 'achievement', 'update'],
      mutationFn: updateUserAchievement,
    });

  return { mutate, data, error, status, isPending, isSuccess, isError };
};

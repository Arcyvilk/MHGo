import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../utils/consts';
import { News } from './types/News';
import { UserAmount } from './types';

/**
 *
 */
export const useUserApi = (userId: string) => {
  const getNews = async (): Promise<News[]> => {
    const res = await fetch(`${API_URL}/users/user/${userId}`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<News[], unknown, News[], string[]>({
    queryKey: ['user', userId],
    queryFn: getNews,
  });

  return { data, isLoading, isFetched, isError };
};

/**
 *
 */
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

/**
 *
 */
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

/**
 *
 */
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

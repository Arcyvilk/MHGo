import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserAuth, UserBan } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher, useLocalStorage, useSessionStorage } from '..';

type UserAuthInfo = Pick<
  UserAuth,
  'isAdmin' | 'isAwaitingModApproval' | 'isModApproved'
> &
  UserBan;
export const useMeApi = () => {
  const getItems = async (): Promise<UserAuthInfo> => {
    const res = await fetcher(`${API_URL}/auth/me`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    UserAuthInfo,
    unknown,
    UserAuthInfo,
    string[]
  >({
    queryKey: ['me'],
    queryFn: getItems,
  });

  return { data, isLoading, isFetched, isError };
};

export const useLoginApi = () => {
  const [isLoggedIn, setIsLoggedIn] = useSessionStorage(
    'MHGO_LOGGED_IN',
    false,
  );
  const [bearerToken, setBearerToken] = useLocalStorage<
    Record<string, string | null>
  >('MHGO_AUTH', {
    bearer: null,
  });

  const login = async (variables: {
    userName: string;
    pwd: string;
  }): Promise<{ userId: string; token: string }> => {
    const response = await fetcher(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');

    return response.json();
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', 'login'],
    mutationFn: login,
    onSuccess: data => {
      if (data?.token) {
        setBearerToken({ bearer: data?.token ?? null });
        setIsLoggedIn(true);
      }
    },
    onError: (err: string) => {
      setBearerToken({ bearer: null });
      toast.error(err.toString());
      setIsLoggedIn(false);
    },
  });

  return { mutate, error, status, isPending, isSuccess, isError, isLoggedIn };
};

export const useSignInApi = () => {
  const login = async (variables: {
    userName: string;
    email: string;
    pwd: string;
  }): Promise<{ userId: string; token: string }> => {
    const response = await fetcher(`${API_URL}/auth/signIn`, {
      method: 'POST',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');

    return response.json();
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', 'signin'],
    mutationFn: login,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserAuth, UserBan } from '@mhgo/types';

import { API_URL } from '../env';
import { useSessionStorage } from '..';

type UserAuthInfo = Pick<
  UserAuth,
  'isAdmin' | 'isAwaitingModApproval' | 'isModApproved'
> &
  UserBan;
export const useUserAuth = (userId: string) => {
  const getItems = async (): Promise<UserAuthInfo> => {
    const res = await fetch(`${API_URL}/auth/user/${userId}`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    UserAuthInfo,
    unknown,
    UserAuthInfo,
    string[]
  >({
    queryKey: ['user', 'auth', userId, 'info'],
    queryFn: getItems,
  });

  return { data, isLoading, isFetched, isError };
};

export const useLoginApi = () => {
  const [isLoggedIn, setIsLoggedIn] = useSessionStorage('LOGIN_STATUS', false);

  const login = async (variables: {
    userName: string;
    pwd: string;
  }): Promise<UserAuth> => {
    const response = await fetch(`${API_URL}/auth/login`, {
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
    onSuccess: () => {
      setIsLoggedIn(true);
    },
    onError: (err: string) => {
      setIsLoggedIn(false);
      toast.error(err.toString());
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
    const response = await fetch(`${API_URL}/auth/signIn`, {
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

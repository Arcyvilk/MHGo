import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserAuth, UserBan } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

type UserAuthInfo = Pick<
  UserAuth,
  'isAdmin' | 'isAwaitingModApproval' | 'isModApproved'
> &
  UserBan;
export const useMeApi = () => {
  const getMe = async (): Promise<UserAuthInfo> => {
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
    queryFn: getMe,
  });

  return { data, isLoading, isFetched, isError };
};

export const useLoginApi = (
  setIsLoggedIn: (isLoggedIn: { loggedIn: boolean }) => void,
  setBearerToken: (bearerToken: { bearer: string | null }) => void,
) => {
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
        setIsLoggedIn({ loggedIn: true });
      }
    },
    onError: (err: string) => {
      setBearerToken({ bearer: null });
      toast.error(err.toString());
      setIsLoggedIn({ loggedIn: false });
    },
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useLogoutApi = (
  setIsLoggedIn: (isLoggedIn: { loggedIn: boolean }) => void,
  setBearerToken: (bearerToken: { bearer: string | null }) => void,
) => {
  const logOut = async (): Promise<boolean> => {
    const res = await fetcher(`${API_URL}/auth/logout`);
    if (res.status !== 200)
      throw new Error((await res.json()).error ?? 'Did not work!');
    return true;
  };

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logOut,
    onSuccess: () => {
      setIsLoggedIn({ loggedIn: false });
      setBearerToken({ bearer: null });
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

export const useSignInApi = (
  setIsLoggedIn: (isLoggedIn: { loggedIn: boolean }) => void,
  setBearerToken: (bearerToken: { bearer: string | null }) => void,
) => {
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
    onSuccess: data => {
      if (data?.token) {
        setBearerToken({ bearer: data?.token ?? null });
        setIsLoggedIn({ loggedIn: true });
      }
    },
    onError: (err: string) => {
      setBearerToken({ bearer: null });
      toast.error(err.toString());
      setIsLoggedIn({ loggedIn: false });
    },
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

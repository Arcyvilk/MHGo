import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserAuth, UserBan } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

type UserAuthInfo = Pick<
  UserAuth,
  'isAdmin' | 'isAwaitingModApproval' | 'isModApproved'
> &
  UserBan & { status: number };
export const useMeApi = (/*enabled: boolean = true*/) => {
  const getMe = async (): Promise<UserAuthInfo | null> => {
    const bearer = JSON.parse(localStorage?.MHGO_AUTH ?? '{}')?.bearer;
    if (!bearer) return null;
    const res = await fetcher(`${API_URL}/auth/me`);
    const response = await res.json();
    const responseWithStatusCode = {
      ...response,
      status: res.status,
    };
    return responseWithStatusCode;
  };

  const { data, isLoading, isFetched, isError } = useSuspenseQuery<
    UserAuthInfo | null,
    unknown,
    UserAuthInfo | null,
    string[]
  >({
    queryKey: ['me'],
    queryFn: getMe,
    // enabled,
  });

  return { data, isLoading, isFetched, isError };
};

export const useLoginApi = (
  setBearerToken: (bearerToken: { bearer: string | null }) => void,
) => {
  const queryClient = useQueryClient();

  const login = async (variables: {
    userName: string;
    pwd: string;
  }): Promise<{ userId: string; token: string }> => {
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
    onSuccess: data => {
      if (data?.token) {
        setBearerToken({ bearer: data?.token ?? null });
        queryClient.invalidateQueries({ queryKey: ['me'] });
        queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['admin'], exact: false });
      }
    },
    onError: (err: string) => {
      setBearerToken({ bearer: null });
      toast.error(err.toString());
    },
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useLogoutApi = (
  setBearerToken: (bearerToken: { bearer: string | null }) => void,
) => {
  const queryClient = useQueryClient();

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
      setBearerToken({ bearer: null });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['admin'], exact: false });
    },
    onError: () => {
      setBearerToken({ bearer: null });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['admin'], exact: false });
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

export const useSignInApi = (
  setBearerToken: (bearerToken: { bearer: string | null }) => void,
) => {
  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries({ queryKey: ['me'] });
        queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['admin'], exact: false });
      }
    },
    onError: (err: string) => {
      setBearerToken({ bearer: null });
      toast.error(err.toString());
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['admin'], exact: false });
    },
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

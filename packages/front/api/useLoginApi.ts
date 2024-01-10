import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

import { API_URL } from '../env';
import { useSessionStorage } from '..';

export const useLoginApi = () => {
  const [isLoggedIn, setIsLoggedIn] = useSessionStorage('LOGIN_STATUS', {
    isLoggedIn: false,
  });

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
    onSuccess: () => {
      setIsLoggedIn({ isLoggedIn: true });
    },
    onError: (err: string) => {
      setIsLoggedIn({ isLoggedIn: false });
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

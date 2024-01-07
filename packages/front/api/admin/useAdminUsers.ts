import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { User, UserResetType } from '@mhgo/types';

import { API_URL } from '../../env';

export const useAdminAllUsersApi = () => {
  const getAllUsers = async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/admin/users/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<User[], unknown, User[], string[]>({
    queryKey: ['admin', 'users', 'all'],
    queryFn: getAllUsers,
  });

  return { data, isLoading, isFetched, isError };
};

// Update user
export const useAdminUpdateUserApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateResource = async ({
    userId,
    user,
  }: {
    userId: string;
    user: User;
  }): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/users/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');

    queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'all'] });
    queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
  };

  // Reset user (not delete, just reset)
  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'user', 'update'],
    mutationFn: adminUpdateResource,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useAdminResetUserApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateResource = async (variables: {
    userId: string;
    toReset: UserResetType;
  }): Promise<void> => {
    const { userId, toReset } = variables;
    const response = await fetch(
      `${API_URL}/admin/users/user/${userId}/reset`,
      {
        method: 'PUT',
        body: JSON.stringify(toReset),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');

    queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'user'] });
    queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'users', 'reset'],
    mutationFn: adminUpdateResource,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useAdminUserGodmodeApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateResource = async (userId: string): Promise<void> => {
    const response = await fetch(
      `${API_URL}/admin/users/user/${userId}/godmode`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');

    queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'users', 'godmode'],
    mutationFn: adminUpdateResource,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

import { useQuery } from '@tanstack/react-query';
import { User } from '@mhgo/types';

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

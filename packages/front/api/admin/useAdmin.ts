import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings } from '@mhgo/types';

import { API_URL } from '../../env';

export const useAdminUpdateSettingsApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateItem = async (
    settings: Settings<unknown>,
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/settings/update`, {
      method: 'PUT',
      body: JSON.stringify(settings),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200 && response.status !== 201)
      throw new Error('Did not work!');
    queryClient.invalidateQueries({ queryKey: ['settings'] });
    queryClient.invalidateQueries({ queryKey: ['settings', 'all'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'settings', 'update'],
    mutationFn: adminUpdateItem,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

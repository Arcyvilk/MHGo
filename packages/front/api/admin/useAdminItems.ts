import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Item } from '@mhgo/types';

import { API_URL } from '../../env';

export const useAdminUpdateItemApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateItem = async (variables: Item): Promise<void> => {
    const { id, ...itemProperties } = variables;
    const response = await fetch(
      `${API_URL}/admin/items/item/${variables.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(itemProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error('Did not work!');
    queryClient.invalidateQueries({ queryKey: ['items'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'item', 'update'],
    mutationFn: adminUpdateItem,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

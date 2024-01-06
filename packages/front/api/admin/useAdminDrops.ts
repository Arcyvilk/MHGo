import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MonsterDrop } from '@mhgo/types';

import { API_URL } from '../../env';

export const useAdminUpdateMonsterDropsApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateMonster = async (variables: MonsterDrop): Promise<void> => {
    const { monsterId, drops } = variables;
    const response = await fetch(
      `${API_URL}/admin/monsters/monster/${monsterId}/drops`,
      {
        method: 'PUT',
        body: JSON.stringify(drops),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!'); 
    queryClient.invalidateQueries({ queryKey: ['drops', 'monster'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'monster', 'drops', 'update'],
    mutationFn: adminUpdateMonster,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

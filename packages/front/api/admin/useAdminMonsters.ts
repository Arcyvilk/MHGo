import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Monster, MonsterDrop } from '@mhgo/types';

import { API_URL } from '../../env';

// Create monster
export const useAdminCreateMonsterApi = () => {
  const queryClient = useQueryClient();

  const adminCreateMonster = async (variables: {
    monster: Monster;
    drops: MonsterDrop;
  }): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/monsters/create`, {
      method: 'POST',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201) throw new Error('Could not create a monster!');
    queryClient.invalidateQueries({ queryKey: ['monsters'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'monster', 'create'],
    mutationFn: adminCreateMonster,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

// Update monster
export const useAdminUpdateMonsterApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateMonster = async (variables: Monster): Promise<void> => {
    const { id, ...monsterProperties } = variables;
    const response = await fetch(
      `${API_URL}/admin/monsters/monster/${variables.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(monsterProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error('Could not update the monster!');
    queryClient.invalidateQueries({ queryKey: ['monsters'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'monster', 'update'],
    mutationFn: adminUpdateMonster,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

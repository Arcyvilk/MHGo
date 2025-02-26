import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Monster, MonsterDrop } from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher, removeCdnUrl } from '../..';

// Create monster
export const useAdminCreateMonsterApi = () => {
  const queryClient = useQueryClient();

  const adminCreateMonster = async (variables: {
    monster: Monster;
    drops: MonsterDrop;
  }): Promise<void> => {
    const { monster, drops } = variables;
    const fixedMonsterProperties = {
      ...monster,
      img: removeCdnUrl(monster.img),
      thumbnail: removeCdnUrl(monster.thumbnail),
    };
    const response = await fetcher(`${API_URL}/admin/monsters/create`, {
      method: 'POST',
      body: JSON.stringify({ monster: fixedMonsterProperties, drops }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201) throw new Error('Could not create a monster!');
    queryClient.invalidateQueries({ queryKey: ['monsters'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'monster', 'create'],
    mutationFn: adminCreateMonster,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Update monster
export const useAdminUpdateMonsterApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateMonster = async (variables: Monster): Promise<void> => {
    const { id, ...monsterProperties } = variables;
    const fixedMonsterProperties = {
      ...monsterProperties,
      img: removeCdnUrl(monsterProperties.img),
      thumbnail: removeCdnUrl(monsterProperties.thumbnail),
    };
    const response = await fetcher(
      `${API_URL}/admin/monsters/monster/${variables.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(fixedMonsterProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['monsters'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'monster', 'update'],
    mutationFn: adminUpdateMonster,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Delete monster
export const useAdminDeleteMonsterApi = () => {
  const queryClient = useQueryClient();

  const adminDeleteMonster = async (monsterId: string): Promise<void> => {
    const response = await fetcher(
      `${API_URL}/admin/monsters/monster/${monsterId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['monsters'] });
    queryClient.invalidateQueries({ queryKey: ['biomes'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'monster', 'delete'],
    mutationFn: adminDeleteMonster,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

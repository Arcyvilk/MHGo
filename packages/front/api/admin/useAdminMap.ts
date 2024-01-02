import { MonsterMarker } from '@mhgo/types';
import { API_URL } from '../../env';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdminAllMonsterMarkers = () => {
  const getAllMonsterMarkers = async (): Promise<MonsterMarker[]> => {
    const res = await fetch(`${API_URL}/map/markers/monsters/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<MonsterMarker[], unknown, MonsterMarker[], string[]>({
    queryKey: ['markers', 'monsters', 'all'],
    queryFn: getAllMonsterMarkers,
  });

  return { data, isLoading, isFetched, isError };
};

// Create monster marker
export const useAdminCreateMonsterMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminCreateMonsterMarker = async (
    variables: Omit<MonsterMarker, 'id' | 'respawnTime'>,
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/marker/monster/create`, {
      method: 'POST',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error('Could not create the monster marker!');

    queryClient.invalidateQueries({ queryKey: ['markers', 'monsters', 'all'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'monster', 'create'],
    mutationFn: adminCreateMonsterMarker,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

// Update monster marker
export const useAdminUpdateMonsterMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateMonsterMarker = async (
    variables: MonsterMarker,
  ): Promise<void> => {
    const { id, ...monsterProperties } = variables;
    const response = await fetch(
      `${API_URL}/admin/marker/monster/${variables.id}`,
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
      throw new Error('Could not update the monster marker!');

    queryClient.invalidateQueries({ queryKey: ['markers', 'monsters', 'all'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'monster', 'update'],
    mutationFn: adminUpdateMonsterMarker,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

// Delete monster marker
export const useAdminDeleteMonsterMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminDeleteMonsterMarker = async (variables: {
    markerId: string;
  }): Promise<void> => {
    const response = await fetch(
      `${API_URL}/admin/marker/monster/${variables.markerId}`,
      { method: 'DELETE' },
    );

    if (response.status !== 200)
      throw new Error('Could not delete the monster marker!');

    queryClient.invalidateQueries({ queryKey: ['markers', 'monsters', 'all'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'monster', 'delete'],
    mutationFn: adminDeleteMonsterMarker,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

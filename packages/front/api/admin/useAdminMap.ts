import { MonsterMarker, ResourceMarker } from '@mhgo/types';
import { API_URL } from '../../env';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdminAllMonsterMarkersApi = () => {
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
    queryKey: ['admin', 'markers', 'monsters', 'all'],
    queryFn: getAllMonsterMarkers,
  });

  return { data, isLoading, isFetched, isError };
};

// Create monster marker
export const useAdminCreateMonsterMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminCreateMonsterMarker = async (
    variables: Omit<MonsterMarker, 'id'>,
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
      throw new Error((await response.json()).error ?? 'Did not work!'); 

    queryClient.invalidateQueries({
      queryKey: ['admin', 'markers', 'monsters', 'all'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'monster', 'create'],
    mutationFn: adminCreateMonsterMarker,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
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
      throw new Error((await response.json()).error ?? 'Did not work!'); 

    queryClient.invalidateQueries({
      queryKey: ['admin', 'markers', 'monsters', 'all'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'monster', 'update'],
    mutationFn: adminUpdateMonsterMarker,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
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
      throw new Error((await response.json()).error ?? 'Did not work!'); 

    queryClient.invalidateQueries({
      queryKey: ['admin', 'markers', 'monsters', 'all'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'monster', 'delete'],
    mutationFn: adminDeleteMonsterMarker,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Create resource marker
export const useAdminCreateResourceMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminCreateMonsterMarker = async (
    variables: Omit<ResourceMarker, 'id'>,
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/marker/resource/create`, {
      method: 'POST',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!'); 

    queryClient.invalidateQueries({ queryKey: ['markers', 'resource', 'all'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'resource', 'create'],
    mutationFn: adminCreateMonsterMarker,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Update resource marker
export const useAdminUpdateResourceMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateResourceMarker = async (
    variables: ResourceMarker,
  ): Promise<void> => {
    const { id, ...resourceProperties } = variables;
    const response = await fetch(
      `${API_URL}/admin/marker/resource/${variables.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(resourceProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!'); 

    queryClient.invalidateQueries({ queryKey: ['markers', 'resource', 'all'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'resource', 'update'],
    mutationFn: adminUpdateResourceMarker,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Delete resource marker
export const useAdminDeleteResourceMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminDeleteResourceMarker = async (variables: {
    markerId: string;
  }): Promise<void> => {
    const response = await fetch(
      `${API_URL}/admin/marker/resource/${variables.markerId}`,
      { method: 'DELETE' },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!'); 

    queryClient.invalidateQueries({ queryKey: ['markers', 'resource', 'all'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'marker', 'resource', 'delete'],
    mutationFn: adminDeleteResourceMarker,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

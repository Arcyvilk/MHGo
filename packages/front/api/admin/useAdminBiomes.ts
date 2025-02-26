import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Biome } from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher, removeCdnUrl } from '../..';

// Create biome
export const useAdminCreateBiomeApi = () => {
  const queryClient = useQueryClient();

  const adminCreateBiome = async (variables: Biome): Promise<void> => {
    const fixedBiome = {
      ...variables,
      image: removeCdnUrl(variables.image),
    };
    const response = await fetcher(`${API_URL}/admin/biomes/create`, {
      method: 'POST',
      body: JSON.stringify(fixedBiome),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['biomes'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'biome', 'create'],
    mutationFn: adminCreateBiome,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Update biome
export const useAdminUpdateBiomeApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateBiome = async (variables: Biome): Promise<void> => {
    const { id, ...biomeProperties } = variables;
    const fixedBiomeProperties = {
      ...biomeProperties,
      image: removeCdnUrl(biomeProperties.image),
    };
    const response = await fetcher(`${API_URL}/admin/biomes/biome/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fixedBiomeProperties),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['biomes'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'biomes', 'update'],
    mutationFn: adminUpdateBiome,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

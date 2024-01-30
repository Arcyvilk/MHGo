import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Habitat } from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher, removeCdnUrl } from '../..';

// Create habitat
export const useAdminCreateHabitatApi = () => {
  const queryClient = useQueryClient();

  const adminCreateHabitat = async (variables: Habitat): Promise<void> => {
    const fixedHabitat = {
      ...variables,
      img: removeCdnUrl(variables.image),
    };
    const response = await fetcher(`${API_URL}/admin/habitats/create`, {
      method: 'POST',
      body: JSON.stringify(fixedHabitat),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['habitats'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'habitat', 'create'],
    mutationFn: adminCreateHabitat,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Update habitat
export const useAdminUpdateHabitatApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateHabitat = async (variables: Habitat): Promise<void> => {
    const { id, ...habitatProperties } = variables;
    const fixedHabitatProperties = {
      ...habitatProperties,
      img: removeCdnUrl(habitatProperties.image),
    };
    const response = await fetcher(`${API_URL}/admin/habitats/habitat/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fixedHabitatProperties),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['habitats'] });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'habitats', 'update'],
    mutationFn: adminUpdateHabitat,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

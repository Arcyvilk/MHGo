import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Resource } from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher, removeCdnUrl } from '../..';

// Create resource
export const useAdminCreateResourceApi = () => {
  const queryClient = useQueryClient();

  const adminCreateResource = async (variables: Resource): Promise<void> => {
    const fixedResource = {
      ...variables,
      img: removeCdnUrl(variables.img),
      thumbnail: removeCdnUrl(variables.thumbnail),
    };
    const response = await fetcher(`${API_URL}/admin/resources/create`, {
      method: 'POST',
      body: JSON.stringify(fixedResource),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');

    queryClient.invalidateQueries({
      queryKey: ['drops', 'resource'],
      exact: false,
    });
    queryClient.invalidateQueries({ queryKey: ['resources'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'resource', 'create'],
    mutationFn: adminCreateResource,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// Update resource
export const useAdminUpdateResourceApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateResource = async (variables: Resource): Promise<void> => {
    const { id, ...resourceProperties } = variables;
    const fixedResourceProperties = {
      ...resourceProperties,
      img: removeCdnUrl(resourceProperties.img),
      thumbnail: removeCdnUrl(resourceProperties.thumbnail),
    };
    const response = await fetcher(
      `${API_URL}/admin/resources/resource/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(fixedResourceProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');

    queryClient.invalidateQueries({
      queryKey: ['drops', 'resource'],
      exact: false,
    });
    queryClient.invalidateQueries({ queryKey: ['resources'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'resources', 'update'],
    mutationFn: adminUpdateResource,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

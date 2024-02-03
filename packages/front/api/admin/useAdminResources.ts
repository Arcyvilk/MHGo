import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Resource, ResourceDrop } from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher, removeCdnUrl } from '../..';

// Create resource
export const useAdminCreateResourceApi = () => {
  const queryClient = useQueryClient();

  const adminCreateResource = async (variables: {
    resource: Resource;
    drops: ResourceDrop;
  }): Promise<void> => {
    const { resource, drops } = variables;
    const fixedResourceProperties = {
      ...resource,
      img: removeCdnUrl(resource.img),
      thumbnail: removeCdnUrl(resource.thumbnail),
    };
    const response = await fetcher(`${API_URL}/admin/resources/create`, {
      method: 'POST',
      body: JSON.stringify({ resource: fixedResourceProperties, drops }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');

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

// Delete resource
export const useAdminDeleteResourceApi = () => {
  const queryClient = useQueryClient();

  const adminDeleteResource = async (resourceId: string): Promise<void> => {
    const response = await fetcher(
      `${API_URL}/admin/resources/resource/${resourceId}`,
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
    queryClient.invalidateQueries({ queryKey: ['resources'] });
    queryClient.invalidateQueries({
      queryKey: ['admin', 'markers', 'resource', 'all'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'resource', 'delete'],
    mutationFn: adminDeleteResource,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

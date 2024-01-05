import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Resource } from '@mhgo/types';

import { API_URL } from '../../env';

// Create resource
export const useAdminCreateResourceApi = () => {
  const queryClient = useQueryClient();

  const adminCreateResource = async (variables: Resource): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/resources/create`, {
      method: 'POST',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error('Could not create a resource!');

    queryClient.invalidateQueries({
      queryKey: ['drops', 'resource'],
      exact: false,
    });
    queryClient.invalidateQueries({ queryKey: ['resources'], exact: false });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'resource', 'create'],
    mutationFn: adminCreateResource,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

// Update resource
export const useAdminUpdateResourceApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateResource = async (variables: Resource): Promise<void> => {
    const { id, ...resourceProperties } = variables;
    const response = await fetch(
      `${API_URL}/admin/resources/resource/${variables.id}`,
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
      throw new Error('Did not work!');

    queryClient.invalidateQueries({
      queryKey: ['drops', 'resource'],
      exact: false,
    });
    queryClient.invalidateQueries({ queryKey: ['resources'], exact: false });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'resources', 'update'],
    mutationFn: adminUpdateResource,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

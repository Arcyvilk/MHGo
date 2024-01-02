import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Material } from '@mhgo/types';

import { API_URL } from '../../env';

// Create material
export const useAdminCreateMaterialApi = () => {
  const queryClient = useQueryClient();

  const adminCreateMaterial = async (variables: Material): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/materials/create`, {
      method: 'POST',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error('Could not create a material!');
    queryClient.invalidateQueries({ queryKey: ['materials'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'material', 'create'],
    mutationFn: adminCreateMaterial,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

// Update material
export const useAdminUpdateMaterialApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateMaterial = async (variables: Material): Promise<void> => {
    const { id, ...materialProperties } = variables;
    const response = await fetch(
      `${API_URL}/admin/materials/material/${variables.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(materialProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error('Did not work!');
    queryClient.invalidateQueries({ queryKey: ['materials'] });
  };

  const { mutate, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'materials', 'update'],
    mutationFn: adminUpdateMaterial,
  });

  return { mutate, status, isPending, isSuccess, isError };
};

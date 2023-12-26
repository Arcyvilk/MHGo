import { useQuery } from '@tanstack/react-query';
import { API_URL, CDN_URL } from '../utils/consts';
import { Material } from './types';

/**
 *
 * @returns
 */
export const useMaterialsApi = () => {
  const getMaterials = async (): Promise<Material[]> => {
    const res = await fetch(`${API_URL}/materials/list`);
    return res.json();
  };

  const {
    data: materials = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Material[], unknown, Material[], string[]>({
    queryKey: ['materials'],
    queryFn: getMaterials,
  });

  const data = materials.map(material => ({
    ...material,
    img: `${CDN_URL}${material.img}`,
  }));

  return { data, isLoading, isFetched, isError };
};

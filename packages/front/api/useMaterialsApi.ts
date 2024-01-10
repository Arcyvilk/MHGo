import { useQuery } from '@tanstack/react-query';
import { Material } from '@mhgo/types';
import { API_URL } from '../env';
import { addCdnUrl } from '../utils/addCdnUrl';
import { fetcher } from '..';

export const useMaterialsApi = () => {
  const getMaterials = async (): Promise<Material[]> => {
    const res = await fetcher(`${API_URL}/materials/list`);
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
    img: addCdnUrl(material.img),
  }));

  return { data, isLoading, isFetched, isError };
};

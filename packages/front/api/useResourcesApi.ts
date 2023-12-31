import { useQuery } from '@tanstack/react-query';
import { Resource } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl } from '../utils/addCdnUrl';

export const useResourcesApi = () => {
  const getResources = async (): Promise<Resource[]> => {
    const res = await fetch(`${API_URL}/resources/list`);
    return res.json();
  };

  const {
    data: resources = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Resource[], unknown, Resource[], string[]>({
    queryKey: ['resources', 'list'],
    queryFn: getResources,
    staleTime: Infinity,
  });

  const data = resources.map(resource => ({
    ...resource,
    img: addCdnUrl(resource.img),
    thumbnail: addCdnUrl(resource.thumbnail),
  }));

  return { data, isLoading, isFetched, isError };
};

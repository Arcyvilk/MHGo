import { useSuspenseQuery } from '@tanstack/react-query';
import { Resource } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl } from '../utils/addCdnUrl';
import { fetcher } from '..';

export const useResourcesApi = (withDisabled: boolean = false) => {
  const getResources = async (): Promise<Resource[]> => {
    const res = await fetcher(`${API_URL}/resources/list`);
    return res.json();
  };

  const {
    data: resources = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Resource[], unknown, Resource[], string[]>({
    queryKey: ['resources', 'list'],
    queryFn: getResources,
  });

  const data = resources
    .filter(resource => (withDisabled ? true : !resource.disabled))
    .map(resource => ({
      ...resource,
      img: addCdnUrl(resource.img),
      thumbnail: addCdnUrl(resource.thumbnail),
    }));

  return { data, isLoading, isFetched, isError };
};

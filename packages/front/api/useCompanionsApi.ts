import { useQuery } from '@tanstack/react-query';
import { Companion } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl } from '../utils/addCdnUrl';
import { fetcher } from '..';

export const useCompanionApi = (companionId: string) => {
  const getCompanion = async (): Promise<Companion> => {
    const path = `${API_URL}/companions/companion/${companionId}`;
    console.log(path);
    const res = await fetcher(path);
    console.log(res);
    return res.json();
  };

  const {
    data: companion = null,
    isLoading,
    isFetched,
    isError,
  } = useQuery<Companion, unknown, Companion, string[]>({
    queryKey: ['companion'],
    queryFn: getCompanion,
    enabled: true,
  });

  console.log(companionId, isLoading, isFetched, isError);

  const data = companion
    ? {
        ...companion,
        img_idle: addCdnUrl(companion.img_idle),
        img_happy: addCdnUrl(companion.img_happy),
        img_surprised: addCdnUrl(companion.img_surprised),
      }
    : null;

  return { data, isLoading, isFetched, isError };
};

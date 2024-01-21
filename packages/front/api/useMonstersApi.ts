import { useSuspenseQuery } from '@tanstack/react-query';
import { Monster } from '@mhgo/types';

import { API_URL } from '../env';
import { addCdnUrl } from '../utils/addCdnUrl';
import { fetcher } from '..';

export const useMonstersApi = () => {
  const getMonsters = async (): Promise<Monster[]> => {
    const res = await fetcher(`${API_URL}/monsters/list`);
    return res.json();
  };

  const {
    data: monsters = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Monster[], unknown, Monster[], string[]>({
    queryKey: ['monsters', 'list'],
    queryFn: getMonsters,
    staleTime: Infinity,
  });

  const data = monsters.map(monster => ({
    ...monster,
    img: addCdnUrl(monster.img),
    thumbnail: addCdnUrl(monster.thumbnail),
  }));

  return { data, isLoading, isFetched, isError };
};

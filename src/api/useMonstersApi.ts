import { useQuery } from '@tanstack/react-query';
import { API_URL, CDN_URL } from '../utils/consts';
import { Monster } from './types/Monsters';

/**
 *
 * @returns
 */
export const useMonstersApi = () => {
  const getMonsters = async (): Promise<Monster[]> => {
    const res = await fetch(`${API_URL}/monsters/list`);
    return res.json();
  };

  const {
    data: monsters = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Monster[], unknown, Monster[], string[]>({
    queryKey: ['monsters', 'list'],
    queryFn: getMonsters,
  });

  const data = monsters.map(monster => ({
    ...monster,
    img: `${CDN_URL}${monster.img}`,
    thumbnail: `${CDN_URL}${monster.thumbnail}`,
  }));

  return { data, isLoading, isFetched, isError };
};

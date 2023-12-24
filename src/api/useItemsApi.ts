import { useQuery } from '@tanstack/react-query';
import { API_URL, CDN_URL } from '../utils/consts';
import { Item } from './types';

/**
 *
 * @returns
 */
export const useItemsApi = () => {
  const getItems = async (): Promise<Item[]> => {
    const res = await fetch(`${API_URL}/items/list`);
    return res.json();
  };

  const {
    data: items = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Item[], unknown, Item[], string[]>({
    queryKey: ['items'],
    queryFn: getItems,
  });

  const data = items.map(item => ({
    ...item,
    img: `${CDN_URL}${item.img}`,
  }));

  return { data, isLoading, isFetched, isError };
};

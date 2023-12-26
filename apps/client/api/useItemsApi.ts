import { useQuery } from '@tanstack/react-query';
import { Item } from '@mhgo/types';

import { API_URL } from '../utils/consts';
import { items as mockItems } from '../_mock/items';
import { addCdnUrl } from '../utils/addCdnUrl';

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
    img: addCdnUrl(item.img),
  }));

  return { data: mockItems, dataNew: data, isLoading, isFetched, isError };
};

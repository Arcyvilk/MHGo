import { useQuery } from '@tanstack/react-query';
import { Item, ItemAction } from '@mhgo/types';

import { API_URL } from '../utils/consts';
import { addCdnUrl } from '../utils/addCdnUrl';

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

  return { data, isLoading, isFetched, isError };
};

export const useItemActionsApi = (itemId: string) => {
  const getItemActions = async (): Promise<ItemAction> => {
    const res = await fetch(`${API_URL}/items/item/${itemId}/actions`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    ItemAction,
    unknown,
    ItemAction,
    string[]
  >({
    queryKey: ['items', itemId, 'actions'],
    queryFn: getItemActions,
    enabled: Boolean(itemId),
  });

  return { data, isLoading, isFetched, isError };
};

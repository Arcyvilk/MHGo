import { useQuery } from '@tanstack/react-query';
import { Item, ItemAction, ItemCraftingList } from '@mhgo/types';

import { API_URL } from '../env';
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

export const useItemCraftListApi = (userId: string, itemId: string) => {
  const getItemCraftList = async (): Promise<ItemCraftingList[]> => {
    const res = await fetch(`${API_URL}/users/user/${userId}/craft/${itemId}`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<ItemCraftingList[], unknown, ItemCraftingList[], string[]>({
    queryKey: ['items', itemId, 'craftList'],
    queryFn: getItemCraftList,
    enabled: Boolean(itemId) && Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

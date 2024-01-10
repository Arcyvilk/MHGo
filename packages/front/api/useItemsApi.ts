import { useQuery } from '@tanstack/react-query';
import {
  CraftList,
  Item,
  ItemAction,
  ItemCraftingList,
  Stats,
  UserAmount,
} from '@mhgo/types';

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
    staleTime: Infinity,
  });

  const data = items.map(item => ({
    ...item,
    img: addCdnUrl(item.img),
  }));

  return { data, isLoading, isFetched, isError };
};

export const useItemActionsApi = (itemId: string | null) => {
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
    queryKey: ['items', itemId!, 'actions'],
    queryFn: getItemActions,
    enabled: Boolean(itemId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useItemCraftsApi = (itemId: string | null) => {
  const getItemCraft = async (): Promise<CraftList[]> => {
    const res = await fetch(`${API_URL}/items/item/${itemId}/crafts`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    CraftList[],
    unknown,
    CraftList[],
    string[]
  >({
    queryKey: ['items', itemId!, 'crafts'],
    queryFn: getItemCraft,
    enabled: Boolean(itemId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useItemPriceApi = (itemId: string | null) => {
  const getItemPrice = async (): Promise<UserAmount[]> => {
    const res = await fetch(`${API_URL}/items/item/${itemId}/price`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    UserAmount[],
    unknown,
    UserAmount[],
    string[]
  >({
    queryKey: ['items', itemId!, 'price'],
    queryFn: getItemPrice,
    enabled: Boolean(itemId),
  });

  return { data, isLoading, isFetched, isError };
};

export const useItemStatsApi = (
  itemId: string | null,
  isEquippable?: boolean,
) => {
  const getItemStats = async (): Promise<Stats> => {
    const res = await fetch(`${API_URL}/items/item/${itemId}/stats`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    Stats,
    unknown,
    Stats,
    string[]
  >({
    queryKey: ['items', itemId!, 'stats'],
    queryFn: getItemStats,
    enabled: isEquippable && Boolean(itemId),
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
    queryKey: ['items', itemId, 'craftList', userId],
    queryFn: getItemCraftList,
    enabled: Boolean(itemId) && Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

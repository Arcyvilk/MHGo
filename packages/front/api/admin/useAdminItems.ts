import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CraftList,
  Item,
  ItemAction,
  ItemPrice,
  Stats,
  UserAmount,
} from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher } from '../..';

type ItemCreate = {
  item: Item;
  itemAction: ItemAction;
  itemCraft: CraftList[];
  itemPrice: UserAmount[];
  itemStats: Stats;
};
export const useAdminCreateItemApi = () => {
  const queryClient = useQueryClient();

  const adminCreateItem = async (variables: ItemCreate): Promise<void> => {
    const response = await fetcher(`${API_URL}/admin/items/create`, {
      method: 'post',
      body: JSON.stringify(variables),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'item', 'create'],
    mutationFn: adminCreateItem,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useAdminUpdateItemApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateItem = async (variables: Item): Promise<void> => {
    const { id, ...itemProperties } = variables;
    const response = await fetcher(
      `${API_URL}/admin/items/item/${variables.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(itemProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'item', 'update'],
    mutationFn: adminUpdateItem,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useAdminUpdateItemPriceApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateItemPrice = async (variables: ItemPrice): Promise<void> => {
    const { itemId, price } = variables;
    const response = await fetcher(
      `${API_URL}/admin/items/item/${itemId}/price`,
      {
        method: 'PUT',
        body: JSON.stringify(price),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'item', 'price', 'update'],
    mutationFn: adminUpdateItemPrice,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useAdminUpdateItemActionApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateItemAction = async (
    variables: ItemAction & { itemId: string },
  ): Promise<void> => {
    const { itemId, ...action } = variables;
    const response = await fetcher(
      `${API_URL}/admin/items/item/${itemId}/action`,
      {
        method: 'PUT',
        body: JSON.stringify(action),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'item', 'action', 'update'],
    mutationFn: adminUpdateItemAction,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useAdminUpdateItemCraftlistApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateItemAction = async (variables: {
    itemId: string;
    craftList: CraftList[];
  }): Promise<void> => {
    const { itemId, craftList } = variables;
    const response = await fetcher(
      `${API_URL}/admin/items/item/${itemId}/crafts`,
      {
        method: 'PUT',
        body: JSON.stringify(craftList),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'item', 'craftlist', 'update'],
    mutationFn: adminUpdateItemAction,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

export const useAdminUpdateItemStatsApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateItemStats = async (variables: {
    itemId: string;
    stats: Stats;
  }): Promise<void> => {
    const { itemId, stats } = variables;
    const response = await fetcher(
      `${API_URL}/admin/items/item/${itemId}/stats`,
      {
        method: 'PUT',
        body: JSON.stringify(stats),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({ queryKey: ['items'], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'item', 'stats', 'update'],
    mutationFn: adminUpdateItemStats,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

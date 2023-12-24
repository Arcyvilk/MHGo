import { useItemsApi } from '../api';

export const useItems = () => {
  const { data: items } = useItemsApi();

  const getItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item;
  };

  return { getItem, items };
};

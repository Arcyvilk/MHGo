import { items } from '../_mock/items';

export const useItems = () => {
  const getItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item;
  };

  return { getItem };
};

import { useUserItems } from './useUser';

export const usePaintballs = (userId: string) => {
  const userItems = useUserItems(userId);
  const paintballs = userItems.find(item => item.id === 'paintball');
  return paintballs?.amount ?? 0;
};

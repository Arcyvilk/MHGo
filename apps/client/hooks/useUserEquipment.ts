import {
  useItemsApi,
  useUserCurrentlyCraftableItemsApi,
  useUserItemsApi,
} from '@mhgo/front';
import { Item as TItem } from '@mhgo/types';
import { useUser } from './useUser';

export const useUserEquipment = () => {
  const { userId } = useUser();
  const { data: allItems } = useItemsApi();
  const { data: userItems } = useUserItemsApi(userId);
  const { data: userCanCraftThoseItems } =
    useUserCurrentlyCraftableItemsApi(userId);

  // We want to show all user items, no matter if craftable or not
  const itemsOwned = userItems
    .map(item => {
      const ownedItem = allItems.find(i => i.id === item.id);
      if (!ownedItem) return null;
      const canBeCrafted = userCanCraftThoseItems?.includes(item.id);
      return {
        ...ownedItem,
        isOwned: true,
        canBeCrafted,
        amount: item.amount,
      };
    })
    .filter(Boolean);

  // On top of that we want to show unowned but craftable items
  const craftableItems = allItems.filter(
    item => item.craftable || item.purchasable,
  );

  const cratableItemsNotOwned = craftableItems
    .filter(item => !userItems.find(i => item.id === i.id))
    .map(item => ({
      ...item,
      isOwned: false,
      canBeCrafted: userCanCraftThoseItems?.includes(item.id),
      amount: 0,
    }));

  // Now we want to sort them to always show in the same order
  const allEquipmentItems = [
    ...itemsOwned,
    ...cratableItemsNotOwned,
  ] as (TItem & {
    isOwned: boolean;
    canBeCrafted: boolean;
  })[];

  const sortedItems = allItems
    .map(item => allEquipmentItems.find(i => i.id === item.id)!)
    .filter(Boolean);

  return sortedItems;
};

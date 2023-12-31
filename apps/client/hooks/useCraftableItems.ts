import { toast } from 'react-toastify';
import { Material } from '@mhgo/types';
import { useItemsApi, useMaterialsApi } from '../api';

export const useCraftableItems = () => {
  const { data: materials } = useMaterialsApi();
  const { data: items } = useItemsApi();

  const craftableItems = items
    .filter(item => item.craftable)
    .map(item => ({
      ...item,
      purchasable: false, // We don't want to purchase items in craft view
    }));

  const onCraft = (itemId: string) => {
    toast.info(`Crafting not implemented yet! [${itemId}]`);
  };

  const getItemCraftingList = (itemId: string) => {
    const itemToCraft = items.find(item => item.id === itemId)!;
    const materialMats = (itemToCraft.craftList ?? [])
      .filter(item => item.craftType === 'material')
      .map(material => ({
        ...materials.find(m => m.id === material.id),
        amount: material.amount,
      }))
      .filter(Boolean);
    const itemMats = (itemToCraft.craftList ?? [])
      .filter(item => item.craftType === 'item')
      .map(item => ({
        ...items.find(i => i.id === item.id),
        amount: item.amount,
      }))
      .filter(Boolean);

    return [...materialMats, ...itemMats] as Material[];
  };

  return { craftableItems, onCraft, getItemCraftingList };
};

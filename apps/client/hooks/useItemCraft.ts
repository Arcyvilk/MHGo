import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Material } from '@mhgo/types';

import {
  useItemCraftListApi,
  useItemsApi,
  useMaterialsApi,
  useUserCraftItemApi,
} from '@mhgo/front';
import { useUser } from './useUser';

export const useItemCraft = (itemId: string) => {
  const { userId } = useUser();

  const { data: materials } = useMaterialsApi();
  const { data: items } = useItemsApi();
  const { data: ingredientAmounts } = useItemCraftListApi(userId, itemId);
  const {
    mutate: mutateCraftItem,
    isSuccess,
    isError,
  } = useUserCraftItemApi(userId, itemId);

  const item = items.find(i => i.id === itemId);

  const onCraft = (amount: number = 1) => {
    mutateCraftItem({ amount });
  };

  useEffect(() => {
    if (isSuccess) toast.success('Item successfully crafted!');
  }, [isSuccess]);
  useEffect(() => {
    if (isError)
      toast.error('Crafting failed! Your ingredients were not consumed.');
  }, [isError]);

  const getItemIngredients = () => {
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

  return { item, ingredientAmounts, onCraft, getItemIngredients, isSuccess };
};

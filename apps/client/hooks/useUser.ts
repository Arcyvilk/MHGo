import { LOADOUT_SLOTS } from '@mhgo/types';
import {
  useItemsApi,
  useUserItemsApi,
  useUserLoadoutApi,
  useUserMaterialsApi,
} from '../api';
import { useMaterials } from './useMaterials';

import { EXP_PER_LEVEL, USER_ID, USER_NAME } from '../_mock/settings';
import { userData } from '../_mock/save';

export const useUser = () => {
  const userId = USER_ID;
  const userName = USER_NAME;

  const user = userData.find(u => u.userId === userId);

  const userArcyId = userName.toLowerCase().replace(' ', '_').concat('666');
  const userExp = (user?.exp ?? 0) % EXP_PER_LEVEL;
  const userLevel = 1 + Math.floor((user?.exp ?? 0) / EXP_PER_LEVEL);

  return { userId, userName, userExp, userLevel, userArcyId };
};

export const useUserItems = (userId: string) => {
  const { data: items } = useItemsApi();
  const { data: userItems } = useUserItemsApi(userId);

  const userItemData = items
    .filter(item => userItems.find(userItem => userItem.id === item.id))
    .map(item => ({
      ...item,
      amount: userItems.find(userItem => userItem.id === item.id)?.amount ?? 0,
    }));
  return userItemData;
};

export const useUserMaterials = (userId: string) => {
  const { materials } = useMaterials();
  const { data: userMaterials } = useUserMaterialsApi(userId);

  const userMaterialData = materials
    .filter(material =>
      userMaterials.find(userMaterial => userMaterial.id === material.id),
    )
    .map(material => ({
      ...material,
      amount:
        userMaterials.find(userMaterial => userMaterial.id === material.id)
          ?.amount ?? 0,
    }));

  return userMaterialData;
};

export const useUserLoadout = (userId: string) => {
  const { data: items } = useItemsApi();
  const { data: loadout } = useUserLoadoutApi(userId);

  const slots = LOADOUT_SLOTS.map(slot => {
    const userSlot = loadout.find(l => l.slot === slot);
    return {
      slot,
      itemId: userSlot?.itemId ?? null,
    };
  });

  const loadoutItems =
    slots.map(slot => items.find(i => i.id === slot.itemId)) ?? [];

  return loadoutItems;
};

import {
  useItemsApi,
  useMaterialsApi,
  useSettingsApi,
  useUserAchievementsApi,
  useUserApi,
  useUserItemsApi,
  useUserLoadoutApi,
  useUserMaterialsApi,
} from '@mhgo/front';
import { ItemSlot } from '@mhgo/types';
import { useMe } from './useAuth';

export const USER_NAME = '-';

export const useUser = () => {
  const { userId } = useMe();
  const { data: user } = useUserApi(userId);
  const { setting: expPerLevel = 1 } = useSettingsApi<number>(
    'exp_per_level',
    0,
  );

  const { name, exp } = user ?? { name: USER_NAME, exp: 0, id: userId };
  const userExp = exp % expPerLevel;
  const userLevel = 1 + Math.floor(exp / expPerLevel);

  return {
    ...user,
    userId: userId ?? '-',
    userName: name,
    userExp,
    userLevel,
  };
};

export const useUserTutorial = (userId: string) => {
  const { data: userAchievements } = useUserAchievementsApi(userId);
  const achievement = userAchievements.find(
    achievement => achievement.achievementId === 'tutorial',
  );
  return { isFinishedTutorial: Boolean(achievement) };
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
  const { data: materials } = useMaterialsApi();
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
  const { setting: loadoutSlots } =
    useSettingsApi<ItemSlot[]>('equipment_slots');

  const slots = loadoutSlots?.map(slot => {
    const userSlot = loadout.find(l => l.slot === slot);
    return {
      slot,
      itemId: userSlot?.itemId ?? null,
    };
  });

  const loadoutItems =
    slots?.map(slot => items.find(i => i.id === slot.itemId)) ?? [];

  return loadoutItems;
};

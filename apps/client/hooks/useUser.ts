import {
  useCompanionApi,
  useItemsApi,
  useMaterialsApi,
  useSettingsApi,
  useTutorialApi,
  useUserAchievementsApi,
  useUserApi,
  useUserItemsApi,
  useUserLoadoutApi,
  useUserMaterialsApi,
} from '@mhgo/front';
import { Companion, ItemSlot, TutorialStep } from '@mhgo/types';
import { useMe } from './useAuth';
import { useMemo } from 'react';
import { useAppContext } from '../utils/context';

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

export const useUserTutorial = (
  userId: string,
  stepFrom?: string,
  stepTo?: string,
) => {
  const { userName } = useUser();
  const { tutorialStep: step, setTutorialStep } = useAppContext();
  const { data: userAchievements } = useUserAchievementsApi(userId);
  const { setting = '' } = useSettingsApi<string>('default_companion', '');
  const { data: companion, isFetched: isCompanionFetched } =
    useCompanionApi(setting);
  const { data: tutorialPart, isFetched: isTutorialFetched } = useTutorialApi(
    stepFrom,
    stepTo,
  );

  const achievement = userAchievements.find(
    achievement => achievement.achievementId === 'tutorial',
  );

  const insertCompanionToTutorial = (c: Companion) => {
    return tutorialPart.tutorial.map((step: TutorialStep) => ({
      ...step,
      ...(step.companionSpeech
        ? {
            companionSpeech: step.companionSpeech
              .replace(/PLAYER_NAME/g, userName)
              .replace(/COMPANION_NAME/g, c.name)
              .replace(/COMPANION_SPECIES/g, c.species),
          }
        : {}),
      ...(step.companionImg
        ? {
            companionImg: c[step.companionImg as keyof Companion],
          }
        : {}),
    }));
  };

  const tutorial = useMemo(() => {
    if (isCompanionFetched && companion)
      return insertCompanionToTutorial(companion);
    else return tutorialPart.tutorial;
  }, [isCompanionFetched, companion]);

  const currentStep = useMemo(() => {
    const curr = tutorial.find(t => t.id === step);
    return curr ?? null;
  }, [tutorial, step]);

  const finishTutorial = () => {
    alert('Tutorial finished');
  };

  const goToNextStep = (onEnd: () => void) => {
    const currStepIndex = tutorial.findIndex(t => t.id === step);
    const nextStep = tutorial[currStepIndex + 1];

    // This part of tutorial still has next step
    if (nextStep) setTutorialStep(nextStep.id);
    // This part of tutorial has finished...
    else {
      // ...but more is coming soon
      if (tutorialPart.nextPartId) setTutorialStep(tutorialPart.nextPartId);
      // And this happens if tutorial finished altogether!
      else {
        finishTutorial();
        onEnd();
      }
    }
  };

  return {
    tutorial,
    currentStep,
    goToNextStep,
    isFinishedTutorial: Boolean(achievement),
    isFetched: isCompanionFetched && isTutorialFetched,
  };
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

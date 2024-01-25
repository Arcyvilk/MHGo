import { useEffect, useState } from 'react';
import { useUserWealthApi } from '@mhgo/front';

import { ModalAchievement } from '../ModalAchievement';
import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../hooks/useUpdateUserAchievement';
import { useUser } from '../../hooks/useUser';

export const GlobalAchievements = () => {
  const { userId } = useUser();
  const {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  } = useGlobalAchievements();

  const { data: userWealth } = useUserWealthApi(userId);

  useEffect(() => {
    const baseMoney = userWealth.find(u => u.id === 'base')?.amount ?? 0;
    if (baseMoney)
      updateAchievement(
        AchievementId.HOARDER_EXTRAORDINAIRE,
        true,
        0,
        baseMoney,
      );
  }, [userWealth]);

  if (!isModalAchievementOpen) return null;
  return (
    <ModalAchievement
      achievementId={achievementId}
      isOpen={isModalAchievementOpen}
      setIsOpen={setIsModalAchievementOpen}
    />
  );
};

// Not sure how this would work if more than one achievement would get unlocked.
const useGlobalAchievements = () => {
  const [achievementId, setAchievementId] = useState<AchievementId>();
  const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);
  const [isAchievementUnlocked, setIsAchievementUnlocked] = useState(false);
  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();

  const updateAchievement = (
    id: AchievementId,
    condition: boolean,
    progress: number = 0, // this to add to current achievement progress
    newValue: number = 0, // this to set the achievement's progress to
  ) => {
    if (condition) {
      setAchievementId(id);
      mutate({ achievementId: id, progress, newValue });
    }
  };

  useEffect(() => {
    if (!achievementId) return;
    const { unlockedNewAchievement } = getIsAchievementUnlocked(achievementId);
    setIsAchievementUnlocked(Boolean(unlockedNewAchievement));
  }, [achievementId, isAchievementUpdateSuccess]);

  useEffect(() => {
    if (isAchievementUnlocked) setIsModalAchievementOpen(true);
  }, [isAchievementUnlocked]);

  return {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  };
};

import { useAchievementsApi, useUserUpdateAchievementApi } from '@mhgo/front';
import { useUser } from './useUser';

export enum AchievementId {
  HABEMUS_PAPAM = 'habemus_papam',
  TGTG = 'tgtg',
  DARK_ARTS = 'dark_arts',
}

export const useUpdateUserAchievement = () => {
  const { userId } = useUser();
  const { data: allAchievements } = useAchievementsApi();
  const {
    mutate,
    data: userAchievement,
    isSuccess,
  } = useUserUpdateAchievementApi(userId);

  const getIsAchievementUnlocked = (achievementId: AchievementId) => {
    const achievement = allAchievements.find(a => a.id === achievementId);
    const unlockedNewAchievement =
      userAchievement?.unlockDate &&
      userAchievement.progress === achievement?.maxProgress;

    return { unlockedNewAchievement };
  };

  return { mutate, getIsAchievementUnlocked, isSuccess };
};

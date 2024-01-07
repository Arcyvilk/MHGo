import {
  CloseButton,
  modifiers,
  useAchievementsApi,
  useUserAchievementsApi,
} from '@mhgo/front';
import { Achievement, UserAchievement } from '@mhgo/types';

import s from './AchievementsView.module.scss';
import { useUser } from '../../hooks/useUser';

export const AchievementsView = () => {
  const achievements = useAchievementsWithUnlock();

  return (
    <div className={s.achievementsView}>
      <div className={s.header}>
        <div className={s.header__title}>Achievements</div>
      </div>
      <div className={s.achievementsView__wrapper}>
        {achievements.map(achievement => (
          <AchievementTile achievement={achievement} />
        ))}
      </div>
      <CloseButton />
    </div>
  );
};

type AchievementTileProps = {
  achievement: Achievement & Omit<UserAchievement, 'achievementId'>;
};
const AchievementTile = ({ achievement }: AchievementTileProps) => {
  // console.log(achievement);
  return (
    <div
      className={modifiers(s, 'achievement', {
        unlocked: achievement.unlockDate,
      })}>
      <img className={s.achievement__img} src={achievement.img} />
      <div className={s.achievement__details}>
        <h2 className={s.achievement__name}>{achievement.name}</h2>
        <div className={s.achievement__description}>
          {achievement.description}
        </div>
        <progress />
      </div>
    </div>
  );
};

const useAchievementsWithUnlock = () => {
  const { userId } = useUser();
  const { data: achievements } = useAchievementsApi();
  const { data: userAchievements } = useUserAchievementsApi(userId);

  console.log(achievements);
  console.log(userAchievements);

  const achievementsWithUnlock = achievements.map(achievement => {
    const userProgress: UserAchievement = userAchievements.find(
      ua => ua.achievementId === achievement.id,
    ) ?? { achievementId: achievement.id, progress: 0, unlockDate: null };
    return {
      ...achievement,
      progress: userProgress.progress,
      unlockDate: userProgress.unlockDate,
    };
  });

  return achievementsWithUnlock;
};

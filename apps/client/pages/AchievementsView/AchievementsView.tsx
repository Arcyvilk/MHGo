import {
  CloseButton,
  ProgressBar,
  Switch,
  addCdnUrl,
  modifiers,
  useAchievementsApi,
  useUserAchievementsApi,
} from '@mhgo/front';
import { Achievement, UserAchievement } from '@mhgo/types';

import s from './AchievementsView.module.scss';
import { useUser } from '../../hooks/useUser';
import { useState } from 'react';

export const AchievementsView = () => {
  const achievements = useAchievementsWithUnlock();
  const [showUnlocked, setShowUnlocked] = useState(true);
  const [showLocked, setShowLocked] = useState(true);

  const sortedAchievements = [
    ...achievements.filter(a => !a.hidden),
    ...achievements.filter(a => a.hidden),
  ];

  return (
    <div className={s.achievementsView}>
      <div className={s.header}>
        <div className={s.header__title}>Achievements</div>
      </div>
      <div className={s.achievementsView__wrapper}>
        <div className={s.achievementsView__actions}>
          <Switch
            label="Show unlocked"
            checked={showUnlocked}
            setChecked={setShowUnlocked}
          />
          <Switch
            label="Show locked"
            checked={showLocked}
            setChecked={setShowLocked}
          />
        </div>
        {sortedAchievements
          .filter(achievement => {
            const isUnlocked =
              achievement.unlockDate &&
              achievement.progress === achievement.maxProgress;
            if (showUnlocked && isUnlocked) return true;
            if (showLocked && !isUnlocked) return true;
            return false;
          })
          .map(achievement => (
            <AchievementTile
              key={`achievement-tile-${achievement.id}`}
              achievement={achievement}
            />
          ))}
      </div>
      <CloseButton backToHome />
    </div>
  );
};

type AchievementTileProps = {
  achievement: Achievement & Omit<UserAchievement, 'achievementId'>;
};
const AchievementTile = ({ achievement }: AchievementTileProps) => {
  const isUnlocked =
    achievement.unlockDate && achievement.progress === achievement.maxProgress;
  const isHidden = !isUnlocked && achievement.hidden;

  if (isHidden)
    return (
      <div
        className={modifiers(s, 'achievement', {
          unlocked: achievement.unlockDate,
        })}>
        <img
          className={s.achievement__img}
          src={addCdnUrl('/misc/question.svg')}
        />
        <div className={s.achievement__details}>
          <h2 className={s.achievement__name}>Achievement hidden</h2>
        </div>
      </div>
    );

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
        {isUnlocked ? (
          <div className={s.achievement__date}>
            <span>✔️</span>{' '}
            <span style={{ fontStyle: 'italic' }}>
              {new Date(achievement!.unlockDate!).toLocaleDateString()},{' '}
              {new Date(achievement!.unlockDate!).toLocaleTimeString()}
            </span>
          </div>
        ) : (
          <ProgressBar
            max={achievement.maxProgress}
            current={achievement.progress}
          />
        )}
      </div>
    </div>
  );
};

const useAchievementsWithUnlock = () => {
  const { userId } = useUser();
  const { data: achievements } = useAchievementsApi();
  const { data: userAchievements } = useUserAchievementsApi(userId);

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

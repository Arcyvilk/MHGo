import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Achievement, UserAchievement, UserAchievements } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserAchievement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const { achievementId, progress } = req.body as Pick<
      UserAchievement,
      'achievementId' | 'progress'
    >;

    // Get achievement in question
    const collectionAchievements = db.collection<Achievement>('achievements');
    const achievement = await collectionAchievements.findOne({
      id: achievementId,
    });

    // Get user achievement
    const collectionUserAchievements =
      db.collection<UserAchievements>('userAchievements');
    const userAchievements =
      (await collectionUserAchievements.findOne({ userId }))?.achievements ??
      [];

    const updatedAchievement = userAchievements.find(
      a => a.achievementId === achievementId,
    ) ?? { achievementId, progress: 0 };

    const newProgress = progress + updatedAchievement.progress;

    const unlockedAchievement: UserAchievement = {
      ...updatedAchievement,
      progress: newProgress,
      unlockDate:
        achievement.maxProgress <= newProgress + updatedAchievement.progress
          ? new Date()
          : null,
    };

    if (unlockedAchievement.progress > achievement.maxProgress) {
      // Silently fail - it's not a bug if achievement progress would be above the limit,
      // we just don't want to update it to become so
      return;
    }

    const response = await collectionUserAchievements.updateOne(
      { userId },
      {
        $set: {
          achievements: [
            ...userAchievements.filter(
              a => a.achievementId !== unlockedAchievement.achievementId,
            ),
            unlockedAchievement,
          ],
        },
      },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update users achievements.' });
    } else {
      res.status(200).send(unlockedAchievement);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

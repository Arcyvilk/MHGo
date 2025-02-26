import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Achievement, UserAchievement, UserAchievements } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserAchievement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { userId } = req.params;

    const { achievementId, progress, newValue } = req.body as Pick<
      UserAchievement,
      'achievementId' | 'progress'
    > & { newValue?: number };

    // Get achievement in question
    const collectionAchievements = db.collection<Achievement>('achievements');
    const achievement = await collectionAchievements.findOne({
      id: achievementId,
    });

    // Achievement does not exist in this adventure.
    if (!achievement) {
      res.sendStatus(410);
      return;
    }

    // Get user achievement
    const collectionUserAchievements =
      db.collection<UserAchievements>('userAchievements');
    const userAchievements =
      (await collectionUserAchievements.findOne({ userId }))?.achievements ??
      [];

    const updatedAchievement = userAchievements.find(
      a => a.achievementId === achievementId,
    ) ?? { achievementId, progress: 0 };

    if (updatedAchievement.progress >= achievement.maxProgress) {
      // Silently fail - it's not a bug if achievement progress would be above the limit,
      // we just don't want to update it to become so
      res.sendStatus(202);
      return;
    }

    const newProgress = newValue
      ? newValue
      : progress + updatedAchievement.progress;

    const unlockedAchievement: UserAchievement = {
      ...updatedAchievement,
      progress: Math.min(newProgress, achievement.maxProgress),
      unlockDate: achievement.maxProgress <= newProgress ? new Date() : null,
    };

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

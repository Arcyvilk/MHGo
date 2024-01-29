import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Quest, UserQuestStory } from '@mhgo/types';

import {
  giveUserExp,
  giveUserItems,
  giveUserMaterials,
  giveUserMoney,
} from '../../helpers/giveUserStuff';
import { mongoInstance } from '../../../api';

export const updateUserStoryQuests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { userId, questId } = req.params;
    const { progress, isClaimed } = req.body;

    if (!userId || !questId) throw new Error('User id or quest id missing!');

    // Check if story quest with this ID exists
    const collectionStoryQuests = db.collection<Quest>('quests');
    const storyQuest = await collectionStoryQuests.findOne({ id: questId });
    if (!storyQuest)
      throw new Error('Story quest with given ID does not exist!');

    const isQuestCompleted = progress >= storyQuest.maxProgress;

    // Check if user currently already has this story quest
    const collectionUserStoryQuests =
      db.collection<UserQuestStory>('userQuests');
    const userQuest = (await collectionUserStoryQuests.findOne({
      userId,
      questId,
    })) ?? { userId, questId, progress: 0, isClaimed, obtainDate: null };

    const updatedUserQuest = {
      ...userQuest,
      isClaimed,
      progress,
      obtainDate: isQuestCompleted ? new Date() : userQuest.obtainDate,
    };

    const responseUserQuests = await collectionUserStoryQuests.updateOne(
      { userId, questId },
      { $set: updatedUserQuest },
      { upsert: true },
    );

    if (!responseUserQuests.acknowledged)
      throw new Error('Could not update user story quest!');

    // If user did not claim the quest rewards, finish here
    if (!isClaimed) {
      res.sendStatus(200);
      return;
    }

    await giveUserItems(userId, db, storyQuest);
    await giveUserMaterials(userId, db, storyQuest);
    await giveUserMoney(userId, db, storyQuest);
    const { oldExp, newExp, oldLevel, newLevel } = await giveUserExp(
      userId,
      db,
      storyQuest,
    );

    // Fin!
    res.status(200).send({ oldExp, newExp, oldLevel, newLevel });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

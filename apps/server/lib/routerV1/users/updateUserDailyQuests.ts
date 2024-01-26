import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Quest, UserQuestDaily } from '@mhgo/types';

import {
  giveUserExp,
  giveUserItems,
  giveUserMaterials,
  giveUserMoney,
} from '../../helpers/giveUserStuff';
import { mongoInstance } from '../../../api';

export const updateUserDailyQuests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId, questId } = req.params;
    const { progress, isClaimed } = req.body;

    if (!userId || !questId) throw new Error('User id or quest id missing!');

    // Check if daily with this ID exists
    const collectionDailyQuests = db.collection<Quest>('questsDaily');
    const dailyQuest = await collectionDailyQuests.findOne({ id: questId });
    if (!dailyQuest)
      throw new Error('Daily quest with given ID does not exist!');

    // Check if user currently has this daily quest available
    const collectionUserDailyQuests =
      db.collection<UserQuestDaily>('userQuestsDaily');
    const userQuests =
      (await collectionUserDailyQuests.findOne({ userId }))?.daily ?? [];
    const hasUserDaily = userQuests.find(quest => quest.id === questId);
    if (!hasUserDaily)
      throw new Error('User does not have this daily quest today!');

    // If they do, update it
    const updatedUserQuests = userQuests.map(quest => {
      if (quest.id !== questId) return quest;
      return {
        ...quest,
        progress,
        isClaimed,
      };
    });

    const responseUserQuests = await collectionUserDailyQuests.updateOne(
      { userId },
      { $set: { daily: updatedUserQuests } },
      { upsert: true },
    );

    if (!responseUserQuests.acknowledged)
      throw new Error('Could not update user daily quest!');

    // If user did not claim the quest rewards, finish here
    if (!isClaimed) {
      res.sendStatus(200);
      return;
    }

    await giveUserItems(userId, db, dailyQuest);
    await giveUserMaterials(userId, db, dailyQuest);
    await giveUserMoney(userId, db, dailyQuest);
    const { oldExp, newExp, oldLevel, newLevel } = await giveUserExp(
      userId,
      db,
      dailyQuest,
    );

    // Fin!
    res.status(200).send({ oldExp, newExp, oldLevel, newLevel });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

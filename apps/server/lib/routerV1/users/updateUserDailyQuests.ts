import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Quest, UserQuestDaily } from '@mhgo/types';

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
    if (!isClaimed) res.sendStatus(200);

    // TODO Give user item rewards
    const dailyRewardsItem = dailyQuest.rewards.filter(
      reward => reward.type === 'item',
    );

    // TODO Give user material rewards
    const dailyRewardsMaterial = dailyQuest.rewards.filter(
      reward => reward.type === 'material',
    );

    // TODO Give user wealth rewards
    const dailyRewardsWealthBase = dailyQuest.payment.filter(
      payment => payment.id === 'base',
    );
    const dailyRewardsWealthPremium = dailyQuest.payment.filter(
      payment => payment.id === 'premium',
    );

    // TODO Give user exp rewards

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

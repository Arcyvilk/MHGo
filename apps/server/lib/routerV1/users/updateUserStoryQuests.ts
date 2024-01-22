import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  Currency,
  Quest,
  Setting,
  UserItems,
  UserMaterials,
  UserQuestStory,
  UserWealth,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { Db } from 'mongodb';

export const updateUserStoryQuests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
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

    // TODO Give user exp rewards

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

/**
 * Give user all the items that are rewards for finishing the quest.
 *
 * @param userId string
 * @param db Db
 * @param storyQuest Quest
 */
const giveUserItems = async (userId: string, db: Db, storyQuest: Quest) => {
  const storyRewardsItem = storyQuest.rewards.filter(
    reward => reward.type === 'item',
  );

  const collectionUserItems = db.collection<UserItems>('userItems');
  const userItems =
    (
      await collectionUserItems.findOne({
        userId,
      })
    )?.items ?? [];
  let updatedUserItems = userItems;

  // Add item rewards to user's inventory
  storyRewardsItem.forEach(storyReward => {
    const userHasItem = updatedUserItems.find(
      userItem => userItem.id === storyReward.id,
    );

    // User already has item, bump its amount
    if (userHasItem) {
      const update = updatedUserItems.map(userItem => {
        if (userItem.id === storyReward.id)
          return { ...userItem, amount: userItem.amount + storyReward.amount };
        else return userItem;
      });
      updatedUserItems = update;
    }
    // User does not have item, add it
    else
      updatedUserItems.push({ id: storyReward.id, amount: storyReward.amount });
  });

  const responseItems = await collectionUserItems.updateOne(
    { userId },
    { $set: { items: updatedUserItems } },
    { upsert: true },
  );

  if (!responseItems.acknowledged)
    throw new Error('Could not update user items.');
};

/**
 * Give user all the materials that are rewards for finishing the quest.
 *
 * @param userId string
 * @param db Db
 * @param storyQuest Quest
 */
const giveUserMaterials = async (userId: string, db: Db, storyQuest: Quest) => {
  const storyRewardsMaterials = storyQuest.rewards.filter(
    reward => reward.type === 'material',
  );

  const collectionUserMaterials = db.collection<UserMaterials>('userMaterials');
  const userMaterials =
    (
      await collectionUserMaterials.findOne({
        userId,
      })
    )?.materials ?? [];
  let updatedUserMaterials = userMaterials;

  // Add material rewards to user's inventory
  storyRewardsMaterials.forEach(storyReward => {
    const userHasMaterial = updatedUserMaterials.find(
      userMaterial => userMaterial.id === storyReward.id,
    );

    // User already has material, bump its amount
    if (userHasMaterial) {
      const update = updatedUserMaterials.map(userItem => {
        if (userItem.id === storyReward.id)
          return { ...userItem, amount: userItem.amount + storyReward.amount };
        else return userItem;
      });
      updatedUserMaterials = update;
    }
    // User does not have material, add it
    else
      updatedUserMaterials.push({
        id: storyReward.id,
        amount: storyReward.amount,
      });
  });

  const responseMaterials = await collectionUserMaterials.updateOne(
    { userId },
    { $set: { materials: updatedUserMaterials } },
    { upsert: true },
  );

  if (!responseMaterials.acknowledged)
    throw new Error('Could not update user materials.');
};

const giveUserMoney = async (userId: string, db: Db, storyQuest: Quest) => {
  // Get base wealth
  const collectionSettings = db.collection<Setting<Currency[]>>('settings');
  const currencies = (
    await collectionSettings.findOne({ key: 'currency_types' })
  )?.value;
  if (!currencies)
    throw new Error("Couldn't get currency types from the database!");

  // Get wealth of user
  const collectionUserWealth = db.collection<UserWealth>('userWealth');
  const userWealth = (
    await collectionUserWealth.findOne({
      userId,
    })
  )?.wealth;

  const updatedWealth = currencies.map(currency => {
    const newWealth = storyQuest.payment.find(
      payment => payment.id === currency.id,
    );
    const newUserAmount = newWealth?.amount ?? 0;
    const oldUserAmount =
      userWealth?.find(u => u.id === currency.id)?.amount ?? 0;

    return {
      id: currency.id,
      amount: oldUserAmount + newUserAmount,
    };
  });

  const response = await collectionUserWealth.updateOne(
    { userId },
    { $set: { wealth: updatedWealth } },
    { upsert: true },
  );

  if (!response.acknowledged) throw new Error('Could not update users wealth.');
};

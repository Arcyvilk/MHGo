import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  Currency,
  Quest,
  Setting,
  UserItems,
  UserMaterials,
  UserQuestDaily,
  UserWealth,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { Db } from 'mongodb';

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

    await giveUserItems(userId, db, dailyQuest);
    await giveUserMaterials(userId, db, dailyQuest);
    await giveUserMoney(userId, db, dailyQuest);

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
 * @param dailyQuest Quest
 */
const giveUserItems = async (userId: string, db: Db, dailyQuest: Quest) => {
  const dailyRewardsItem = dailyQuest.rewards.filter(
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
  dailyRewardsItem.forEach(dailyReward => {
    const userHasItem = updatedUserItems.find(
      userItem => userItem.id === dailyReward.id,
    );

    // User already has item, bump its amount
    if (userHasItem) {
      const update = updatedUserItems.map(userItem => {
        if (userItem.id === dailyReward.id)
          return { ...userItem, amount: userItem.amount + dailyReward.amount };
        else return userItem;
      });
      updatedUserItems = update;
    }
    // User does not have item, add it
    else
      updatedUserItems.push({ id: dailyReward.id, amount: dailyReward.amount });
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
 * @param dailyQuest Quest
 */
const giveUserMaterials = async (userId: string, db: Db, dailyQuest: Quest) => {
  const dailyRewardsMaterials = dailyQuest.rewards.filter(
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
  dailyRewardsMaterials.forEach(dailyReward => {
    const userHasMaterial = updatedUserMaterials.find(
      userMaterial => userMaterial.id === dailyReward.id,
    );

    // User already has material, bump its amount
    if (userHasMaterial) {
      const update = updatedUserMaterials.map(userItem => {
        if (userItem.id === dailyReward.id)
          return { ...userItem, amount: userItem.amount + dailyReward.amount };
        else return userItem;
      });
      updatedUserMaterials = update;
    }
    // User does not have material, add it
    else
      updatedUserMaterials.push({
        id: dailyReward.id,
        amount: dailyReward.amount,
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

const giveUserMoney = async (userId: string, db: Db, dailyQuest: Quest) => {
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
    const newWealth = dailyQuest.payment.find(
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

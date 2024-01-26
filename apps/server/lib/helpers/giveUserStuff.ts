import {
  Currency,
  Quest,
  Setting,
  User,
  UserItems,
  UserMaterials,
  UserWealth,
} from '@mhgo/types';

import { Db } from 'mongodb';

/**
 * Give user all the items that are rewards for finishing the quest.
 *
 * @param userId string
 * @param db Db
 * @param quest Quest
 */
export const giveUserItems = async (userId: string, db: Db, quest: Quest) => {
  const rewardsItem = quest.rewards.filter(reward => reward.type === 'item');

  const collectionUserItems = db.collection<UserItems>('userItems');
  const userItems =
    (
      await collectionUserItems.findOne({
        userId,
      })
    )?.items ?? [];
  let updatedUserItems = userItems;

  // Add item rewards to user's inventory
  rewardsItem.forEach(reward => {
    const userHasItem = updatedUserItems.find(
      userItem => userItem.id === reward.id,
    );

    // User already has item, bump its amount
    if (userHasItem) {
      const update = updatedUserItems.map(userItem => {
        if (userItem.id === reward.id)
          return { ...userItem, amount: userItem.amount + reward.amount };
        else return userItem;
      });
      updatedUserItems = update;
    }
    // User does not have item, add it
    else updatedUserItems.push({ id: reward.id, amount: reward.amount });
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
 * @param quest Quest
 */
export const giveUserMaterials = async (
  userId: string,
  db: Db,
  quest: Quest,
) => {
  const rewardsMaterials = quest.rewards.filter(
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
  rewardsMaterials.forEach(reward => {
    const userHasMaterial = updatedUserMaterials.find(
      userMaterial => userMaterial.id === reward.id,
    );

    // User already has material, bump its amount
    if (userHasMaterial) {
      const update = updatedUserMaterials.map(userItem => {
        if (userItem.id === reward.id)
          return { ...userItem, amount: userItem.amount + reward.amount };
        else return userItem;
      });
      updatedUserMaterials = update;
    }
    // User does not have material, add it
    else
      updatedUserMaterials.push({
        id: reward.id,
        amount: reward.amount,
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

export const giveUserMoney = async (userId: string, db: Db, quest: Quest) => {
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
    const newWealth = quest.payment.find(payment => payment.id === currency.id);
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

export const giveUserExp = async (userId: string, db: Db, quest: Quest) => {
  // Find user
  const collectionUsers = db.collection<User>('users');
  const user = await collectionUsers.findOne({ id: userId });

  // Calculate new experience and new level
  const collectionSettings = db.collection<Setting<number>>('settings');
  const expPerLevel =
    (
      await collectionSettings.findOne({
        key: 'exp_per_level',
      })
    )?.value ?? 100;
  const oldExp = user.exp;
  const newExp = user.exp + (quest?.exp ?? 0);
  const oldLevel = 1 + Math.floor(oldExp / expPerLevel);
  const newLevel = 1 + Math.floor(newExp / expPerLevel);

  const response = await collectionUsers.updateOne(
    { id: userId },
    { $set: { exp: newExp } },
    { upsert: true },
  );

  if (!response.acknowledged) throw new Error('Could not update users exp.');

  return { oldExp, newExp, oldLevel, newLevel };
};

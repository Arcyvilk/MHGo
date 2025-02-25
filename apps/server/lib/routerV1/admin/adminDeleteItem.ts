import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import {
  ChangeReview,
  Drop,
  Item,
  ItemAction,
  ItemCraftList,
  ItemPrice,
  ItemStat,
  Quest,
  UserItems,
  UserLoadout,
} from '@mhgo/types';

export const adminDeleteItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const { itemId } = req.params;

    if (!itemId) throw new Error('Requested item does not exist');

    // Get existing basic data of the item
    const collectionItems = db.collection<Item>('items');
    const item = await collectionItems.findOne({ id: itemId });

    // Prepare object holding information about entities that will require review
    // after deleting this item
    const changesToReview: ChangeReview = {
      date: new Date(),
      changeType: 'delete',
      entityType: 'item',
      entityName: item.name,
      entityId: item.id,
      affectedEntities: [],
    };

    // The records below can be altered without admin's review, because they are
    // tied only to the deleted admin:
    // - itemActions
    // - itemCraft (only the craft list for the deleted item)
    // - itemPrice
    // - itemStats
    // - userItems (might be nice to inform user that they don't have item anymore)
    // - userLoadout (might be nice to inform user that they don't have item anymore)

    // Delete item's actions
    const collectionItemActions = db.collection<ItemAction>('itemActions');
    await collectionItemActions.deleteMany({ itemId });

    // Delete item's crafting details
    const collectionItemCraft = db.collection<ItemCraftList>('itemCraft');
    await collectionItemCraft.deleteMany({ itemId });

    // Delete item's price
    const collectionItemPrice = db.collection<ItemPrice>('itemPrice');
    await collectionItemPrice.deleteMany({ itemId });

    // Delete all item stats
    const collectionItemStats = db.collection<ItemStat>('itemStats');
    await collectionItemStats.deleteMany({ itemId });

    // Delete item from all users' inventory
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems = await collectionUserItems.find().toArray();

    userItems
      .filter(inventory => inventory.items.find(item => item.id === itemId))
      .forEach(inventory => {
        const inventoryWithoutDeletedItem = inventory.items.filter(
          item => item.id !== itemId,
        );

        collectionUserItems.updateOne(
          { userId: inventory.userId },
          { $set: { items: inventoryWithoutDeletedItem } },
        );
      });

    // Delete item from loadouts of all users
    const collectionUserLoadout = db.collection<UserLoadout>('userLoadout');
    const userLoadouts = await collectionUserLoadout.find().toArray();

    userLoadouts
      .filter(userLoadout =>
        userLoadout.loadout.find(item => item.itemId === itemId),
      )
      .forEach(userLoadout => {
        const loadoutWithoutDeletedItem = userLoadout.loadout.filter(
          item => item.itemId !== itemId,
        );

        collectionUserLoadout.updateOne(
          { userId: userLoadout.userId },
          { $set: { loadout: loadoutWithoutDeletedItem } },
        );
      });

    // The records below require admin's review, because they are tied to other
    // resources than just an item and deleting them without review might result
    // in a situation where monster has no drops or item has no ingridients to be
    // crafted.
    // - drops
    // - dropsResource
    // - itemCraft (only items that had deleted item as their ingridients)
    // - quests
    // - questsDaily

    // Delete item from monster drops
    const collectionDrops = db.collection<Drop>('drops');
    // await collectionDrops.deleteMany({ itemId });

    // Delete item from resource drops
    const collectionDropsResource = db.collection<Drop>('dropsResource');
    // await collectionDropsResource.deleteMany({ itemId });

    // Delete item from ingridient list of other items
    // await collectionItemCraft.deleteMany({ itemId });

    // Delete item from quest rewards and requirements
    const collectionQuests = db.collection<Quest>('quests');
    const quests = await collectionQuests.find().toArray();

    quests.forEach(quest => {
      // Remove deleted item from quest requirement list
      const questRequirementsWithoutItem = quest.requirements.filter(
        requirement => {
          if (requirement.type !== 'item') return true;
          return requirement.id !== itemId;
        },
      );

      // Remove deleted item from quest rewards list
      const questRewardsWithoutItem = quest.rewards.filter(reward => {
        if (reward.type !== 'item') return true;
        return reward.id !== itemId;
      });

      // Check if something actually did change
      const isRequirementsChanged =
        quest.requirements.length > questRequirementsWithoutItem.length;
      const isRewardsChanged =
        quest.rewards.length > questRewardsWithoutItem.length;

      // If it did create a change review entry and update the quest entry
      if (isRequirementsChanged || isRewardsChanged) {
        changesToReview.affectedEntities.push({
          isApproved: false,
          id: quest.id,
          type: 'quests',
        });

        collectionQuests.updateOne(
          { id: quest.id },
          {
            $set: {
              ...(isRequirementsChanged
                ? { requirements: questRequirementsWithoutItem }
                : {}),
              ...(isRewardsChanged ? { rewards: questRewardsWithoutItem } : {}),
            },
          },
        );
      }
    });

    // Delete item from daily quest rewards (they have no requirements)
    const collectionQuestsDaily = db.collection<Quest>('questsDaily');
    const questsDaily = await collectionQuestsDaily.find().toArray();

    questsDaily.forEach(quest => {
      // Remove deleted item from quest rewards list
      const questRewardsWithoutItem = quest.rewards.filter(reward => {
        if (reward.type !== 'item') return true;
        return reward.id !== itemId;
      });

      // Check if anything actually changed
      const isRewardsChanged =
        quest.rewards.length > questRewardsWithoutItem.length;

      // If it did create a change review entry and update the quest entry
      if (isRewardsChanged) {
        changesToReview.affectedEntities.push({
          isApproved: false,
          id: quest.id,
          type: 'questsDaily',
        });

        collectionQuestsDaily.updateOne(
          { id: quest.id },
          { $set: { rewards: questRewardsWithoutItem } },
        );
      }
    });

    // TODO THIS SHOULD BE AT THE VERY END!
    // Delete basic item info
    const responseItems = await collectionItems.deleteOne({
      id: itemId,
    });
    if (!responseItems.acknowledged)
      throw new Error('Could not delete this item.');

    const collectionChangeReview = db.collection<ChangeReview>('changeReview');
    await collectionChangeReview.insertOne(changesToReview);

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

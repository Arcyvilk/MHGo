import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import {
  ChangeReview,
  Item,
  ItemAction,
  ItemCraftList,
  ItemPrice,
  ItemStat,
  MonsterDrop,
  Quest,
  ResourceDrop,
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

    // Delete item from ingridient list of other items
    const itemCrafts = await collectionItemCraft
      .find({ 'craftList.craftType': 'item', 'craftList.id': itemId })
      .toArray();

    itemCrafts.forEach(craftedItem => {
      const craftList = craftedItem.craftList.filter(
        item => item.id !== itemId,
      );
      collectionItemCraft.updateOne(
        { itemId: craftedItem.itemId },
        { $set: { craftList } },
      );

      changesToReview.affectedEntities.push({
        isApproved: false,
        id: craftedItem.itemId,
        type: 'itemCraft',
      });
    });

    // Delete item from monster drops
    const collectionDropsMonster = db.collection<MonsterDrop>('drops');
    const dropsMonster = await collectionDropsMonster
      .find({ 'drops.drops.type': 'item', 'drops.drops.id': itemId })
      .toArray();

    dropsMonster.forEach(monster => {
      // This is problematic because it's double nested! Test more!
      const drops = monster.drops.map(level => {
        const filteredDrops = level.drops.filter(drop => drop.id !== itemId);
        return {
          ...level,
          drops: filteredDrops,
        };
      });

      collectionDropsMonster.updateOne(
        { monsterId: monster.monsterId },
        { $set: { drops } },
      );

      changesToReview.affectedEntities.push({
        isApproved: false,
        id: monster.monsterId,
        type: 'drops',
      });
    });

    // Delete item from resource drops
    const collectionDropsResource =
      db.collection<ResourceDrop>('dropsResource');
    const dropsResource = await collectionDropsResource
      .find({ 'drops.type': 'item', 'drops.id': itemId })
      .toArray();

    dropsResource.forEach(resource => {
      const drops = resource.drops.filter(drop => drop.id !== itemId);
      collectionDropsResource.updateOne(
        { resourceId: resource.resourceId },
        { $set: { drops } },
      );

      changesToReview.affectedEntities.push({
        isApproved: false,
        id: resource.resourceId,
        type: 'dropsResource',
      });
    });

    // Delete item from quest rewards and requirements
    const collectionQuests = db.collection<Quest>('quests');
    const quests = await collectionQuests
      .find({
        $or: [
          {
            'rewards.id': itemId,
            'rewards.type': 'item',
          },
          {
            'requirements.id': itemId,
            'requirements.type': 'item',
          },
        ],
      })
      .toArray();

    quests.forEach(quest => {
      // Remove deleted item from requirements
      const requirements = quest.requirements.filter(
        requirement => requirement.id !== itemId,
      );
      // Remove deleted item from rewards
      const rewards = quest.rewards.filter(reward => reward.id !== itemId);

      collectionQuests.updateOne(
        { id: quest.id },
        { $set: { rewards, requirements } },
      );

      changesToReview.affectedEntities.push({
        isApproved: false,
        id: quest.id,
        type: 'quests',
      });
    });

    // Delete item from daily quest rewards (they have no requirements)
    const collectionQuestsDaily = db.collection<Quest>('questsDaily');
    const questsDaily = await collectionQuestsDaily
      .find({ 'rewards.id': itemId, 'rewards.type': 'item' })
      .toArray();

    questsDaily.forEach(quest => {
      const rewards = quest.rewards.filter(r => r.id !== itemId);
      collectionQuestsDaily.updateOne({ id: quest.id }, { $set: { rewards } });

      changesToReview.affectedEntities.push({
        isApproved: false,
        id: quest.id,
        type: 'questsDaily',
      });
    });

    // FINALIZE EVERYTHING!
    // Delete basic item info...
    const responseItems = await collectionItems.deleteOne({
      id: itemId,
    });

    if (!responseItems.acknowledged)
      throw new Error('Could not delete this item.');

    // ...and create a changeReview entry for all the changes
    const collectionChangeReview = db.collection<ChangeReview>('changeReview');
    await collectionChangeReview.insertOne(changesToReview);

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

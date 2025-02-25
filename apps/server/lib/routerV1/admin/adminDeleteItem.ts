import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import {
  Item,
  ItemAction,
  ItemCraftList,
  ItemPrice,
  ItemStat,
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

    // -----------------------------------------
    // CAN BE REMOVED WITHOUT ANY ADMIN REVIEW /
    // -----------------------------------------

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

    // ----------------------------------
    // NEEDS ADMIN REVIEW AFTER REMOVAL /
    // ----------------------------------

    // drops
    // dropsResource
    // itemCraft
    // quests
    // questsDaily

    // TODO THIS SHOULD BE AT THE VERY END!
    // Delete basic item info
    const collectionItems = db.collection<Item>('items');
    const responseItems = await collectionItems.deleteOne({
      id: itemId,
    });
    if (!responseItems.acknowledged)
      throw new Error('Could not delete this item.');

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

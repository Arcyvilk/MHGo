import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Item, ItemToUse, UserItems } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const itemsUsed = req.body as ItemToUse[];

    // Find those items in database
    const collectionItems = db.collection<Item>('items');
    const consumableItemsToUse: ItemToUse[] = [];
    const cursorItems = collectionItems.find({
      id: { $in: itemsUsed.map(i => i.itemId) },
    });

    // Update only items with consumable flag
    for await (const el of cursorItems) {
      if (el.consumable) {
        const consumableItemToUse = itemsUsed.find(i => i.itemId === el.id);
        consumableItemsToUse.push(consumableItemToUse);
      }
    }

    // Get user items
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems = (
      await collectionUserItems.findOne({
        userId,
      })
    )?.items;

    const updatedUserItems = userItems.map(userItem => {
      const itemUsed = itemsUsed.find(i => i.itemId === userItem.id);
      if (itemUsed)
        return {
          ...userItem,
          amount: userItem.amount - itemUsed.amountUsed,
        };
      return userItem;
    });

    const response = await collectionUserItems.updateOne(
      { userId },
      { $set: { items: updatedUserItems } },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update user items.' });
    } else {
      res.sendStatus(200);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

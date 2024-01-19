import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserItems } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const itemsToAdd = req.body as { itemId: string; amount: number }[];

    // Get user items
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems =
      (
        await collectionUserItems.findOne({
          userId,
        })
      )?.items ?? [];

    // Add newly crafted item to user's inventory
    let updatedUserItems = userItems;

    itemsToAdd.forEach(item => {
      const userHasItem = userItems.find(
        userItem => userItem.id === item.itemId,
      );

      // User already has item, bump its amount
      if (userHasItem) {
        updatedUserItems = userItems.map(userItem => {
          if (userItem.id === item.itemId)
            return { ...userItem, amount: userItem.amount + item.amount };
          else return userItem;
        });
      }
      // User does not have item, add it
      else {
        updatedUserItems.push({ id: item.itemId, amount: item.amount });
      }
    });

    // Save everything to database
    const responseItems = await collectionUserItems.updateOne(
      { userId },
      { $set: { items: updatedUserItems } },
      { upsert: true },
    );

    if (!responseItems.acknowledged)
      throw new Error('Could not update user items.');

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

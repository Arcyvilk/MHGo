import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserItems } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserItemCraft = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // const { db } = mongoInstance.getDb();
    // const { userId, itemId } = req.params;

    // // Get user items
    // const collectionUserItems = db.collection<UserItems>('userItems');
    // const userItems = (
    //   await collectionUserItems.findOne({
    //     userId,
    //   })
    // )?.items;

    // const updatedUserItems = userItems.map(userItem => {
    //   const itemUsed = itemsUsed.find(i => i.itemId === userItem.id);
    //   if (itemUsed) {
    //     const newAmount = userItem.amount - itemUsed.amountUsed;
    //     return {
    //       ...userItem,
    //       amount: newAmount >= 0 ? newAmount : 0,
    //     };
    //   }
    //   return userItem;
    // });

    // const response = await collectionUserItems.updateOne(
    //   { userId },
    //   { $set: { items: updatedUserItems } },
    // );

    // if (!response.acknowledged) {
    //   res.status(400).send({ error: 'Could not update user items.' });
    // } else {
    //   res.sendStatus(200);
    // }
    res.sendStatus(404);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { Item } from '@mhgo/types';

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
    // itemActions
    // itemCraft
    // itemPrice
    // itemStats
    // items
    // userItems
    // userLoadout

    // ----------------------------------
    // NEEDS ADMIN REVIEW AFTER REMOVAL /
    // ----------------------------------
    // drops
    // dropsResource
    // itemCraft
    // quests
    // questsDaily

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

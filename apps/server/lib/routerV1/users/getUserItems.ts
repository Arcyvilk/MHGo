import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Item, UserItems } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb(res.locals.adventure);

    // Get all items
    const collectionItems = db.collection<Item>('items');
    const certificateIds = (await collectionItems.find().toArray())
      .filter(item => item.type === 'certificate')
      .map(item => item.id);

    // Get user items
    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems: UserItems = await collectionUserItems.findOne({ userId });

    // Filter out certificate items
    const filteredUserItems = userItems.items?.filter(
      item => !certificateIds.includes(item.id),
    );

    res.status(200).send(filteredUserItems);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserAmount, UserItems } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection<UserItems>('userItems');
    const userItems: UserAmount[] = [];

    const cursor = collection.find({ userId });

    for await (const el of cursor) {
      userItems.push(...el.items);
    }

    res.status(200).send(userItems);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

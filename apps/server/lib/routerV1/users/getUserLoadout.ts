import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '@mhgo/utils';

export const getUserLoadout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection('userLoadout');
    const userLoadout = [];

    const cursor = collection.find({ userId });

    for await (const el of cursor) {
      userLoadout.push(...el.loadout);
    }

    res.status(200).send(userLoadout);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

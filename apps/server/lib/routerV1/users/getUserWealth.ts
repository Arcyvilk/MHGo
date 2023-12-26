import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserAmount, UserWealth } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserWealth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection<UserWealth>('userWealth');
    const userWealth: UserAmount[] = [];

    const cursor = collection.find({ userId });

    for await (const el of cursor) {
      userWealth.push(...el.wealth);
    }

    res.status(200).send(userWealth);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

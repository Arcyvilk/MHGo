import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '../../helpers/log';

export const getUserWealth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection('userWealth');
    const userWealth = [];

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

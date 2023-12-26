import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '@mhgo/utils';

export const getDropsByMonsterId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { monsterId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection('drops');
    const drops = [];

    const cursor = collection.find({ monsterId });

    for await (const el of cursor) {
      drops.push(...el.drops);
    }

    res.status(200).send(drops);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

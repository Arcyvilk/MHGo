import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { MonsterDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateMonsterDrops = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { monsterId } = req.params;
    const drops = req.body as MonsterDrop['drops'];

    const collection = db.collection<MonsterDrop>('drops');

    const response = await collection.updateOne(
      { monsterId },
      { $set: { drops } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update monster drops.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

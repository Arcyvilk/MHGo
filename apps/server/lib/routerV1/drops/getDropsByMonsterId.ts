import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { MonsterDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getDropsByMonsterId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { monsterId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection<MonsterDrop>('drops');

    const monsterDrops = await collection.findOne({ monsterId });

    res.status(200).send(monsterDrops);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

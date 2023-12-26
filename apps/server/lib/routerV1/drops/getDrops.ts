import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { MonsterDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getDrops = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<MonsterDrop>('drops');
    const drops: MonsterDrop[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      drops.push(el);
    }

    res.status(200).send(drops);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

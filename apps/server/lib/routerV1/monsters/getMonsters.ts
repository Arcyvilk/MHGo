import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Monster } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getMonsters = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Monster>('monsters');
    const monsters: Monster[] = [];
    const cursor = collection.find();

    for await (const el of cursor) {
      monsters.push(el);
    }

    res.status(200).send(monsters);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

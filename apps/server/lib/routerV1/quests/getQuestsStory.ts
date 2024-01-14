import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Quest } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getQuestsStory = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Quest>('quests');
    const quests: Quest[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      quests.push(el);
    }

    res.status(200).send(quests);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

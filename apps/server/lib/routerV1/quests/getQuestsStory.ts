import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Quest } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getQuestsStory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res.locals.adventure);
    const collection = db.collection<Quest>('quests');
    const quests: Quest[] = [];

    const cursor = collection.find({ enabled: true });

    for await (const el of cursor) {
      if (el.enabled) quests.push(el);
    }

    res.status(200).send(quests);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

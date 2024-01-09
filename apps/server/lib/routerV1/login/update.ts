import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { News } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const update = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<News>('news');
    const news: News[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      news.push(el);
    }

    res.status(200).send(news);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

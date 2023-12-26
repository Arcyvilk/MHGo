import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '@mhgo/utils';

export const getNews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection('news');
    const news = [];

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

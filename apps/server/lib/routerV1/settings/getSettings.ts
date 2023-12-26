import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Setting } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getSettings = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Setting<unknown>>('settings');
    const settings: Setting<unknown>[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      settings.push(el);
    }

    res.status(200).send(settings);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

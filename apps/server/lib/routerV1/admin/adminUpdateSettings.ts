import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Setting } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const settings = req.body as Setting<unknown>[];

    const collection = db.collection<Setting<unknown>>('settings');

    settings.forEach(
      async setting =>
        await collection.updateOne(
          { key: setting.key },
          { $set: { value: setting.value } },
          { upsert: true },
        ),
    );

    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

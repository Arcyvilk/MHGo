import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Setting } from '@mhgo/types';

import { mongoInstance } from '../../../api';

// TODO When user updates respawn_time_resource or respawn_time_monster,
// it also updates the TTL indexes for the respective markers
export const adminUpdateSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
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

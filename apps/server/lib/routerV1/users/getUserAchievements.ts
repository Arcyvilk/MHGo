import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserAchievements } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserAchievements = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection<UserAchievements>('userAchievements');

    const userAchievements = await collection.findOne({ userId });

    res.status(200).send(userAchievements?.achievements ?? []);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

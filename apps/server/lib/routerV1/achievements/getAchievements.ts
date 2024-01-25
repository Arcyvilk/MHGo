import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Achievement } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getAchievements = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Achievement>('achievements');
    const achievements: Achievement[] = await collection.find({}).toArray();

    res.status(200).send(achievements);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

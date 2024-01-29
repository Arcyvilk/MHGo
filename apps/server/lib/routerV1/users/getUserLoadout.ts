import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserLoadout } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserLoadout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const collection = db.collection<UserLoadout>('userLoadout');

    const userLoadout = await collection.findOne({ userId });

    res.status(200).send(userLoadout?.loadout ?? []);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

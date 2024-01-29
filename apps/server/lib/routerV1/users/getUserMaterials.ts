import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserAmount, UserMaterials } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUserMaterials = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb(res.locals.adventure);
    const collection = db.collection<UserMaterials>('userMaterials');
    const userMaterials: UserAmount[] = [];

    const cursor = collection.find({ userId });

    for await (const el of cursor) {
      userMaterials.push(...el.materials);
    }

    res.status(200).send(userMaterials);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

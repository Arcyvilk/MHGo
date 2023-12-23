import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '../../helpers/log';

export const getUserMaterials = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection('userMaterials');
    const userMaterials = [];

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

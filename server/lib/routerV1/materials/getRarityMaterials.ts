import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '../../helpers/log';

export const getRarityMaterials = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection('rarityMaterials');
    const rarityMaterials = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      rarityMaterials.push(el);
    }

    res.status(200).send(rarityMaterials);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
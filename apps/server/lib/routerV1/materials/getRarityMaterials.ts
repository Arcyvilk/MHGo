import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { FieldByRarity } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getRarityMaterials = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<FieldByRarity>('rarityMaterials');
    const rarityMaterials: FieldByRarity[] = [];

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

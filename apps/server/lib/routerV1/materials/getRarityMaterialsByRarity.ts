import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '@mhgo/utils';

export const getRarityMaterialsByRarity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { rarityId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection('rarityMaterials');
    const rarityMaterials = [];

    const cursor = collection.find({ rarity: Number(rarityId) });

    for await (const el of cursor) {
      rarityMaterials.push(el);
    }

    res.status(200).send(rarityMaterials);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

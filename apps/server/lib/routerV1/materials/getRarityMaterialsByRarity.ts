import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { FieldByRarity } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getRarityMaterialsByRarity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { rarityId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection<FieldByRarity>('rarityMaterials');
    const rarityMaterials: FieldByRarity[] = [];

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

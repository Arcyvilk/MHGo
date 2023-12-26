import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Material } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getMaterials = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Material>('materials');
    const materials: Material[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      materials.push(el);
    }

    res.status(200).send(materials);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

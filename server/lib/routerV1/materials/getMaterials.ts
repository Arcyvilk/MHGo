import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '../../helpers/log';

export const getMaterials = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection('materials');
    const materials = [];

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

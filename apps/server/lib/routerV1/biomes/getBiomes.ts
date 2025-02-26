import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Biome } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getBiomes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const collection = db.collection<Biome>('biomes');
    const biomes: Biome[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      biomes.push(el);
    }

    res.status(200).send(biomes);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

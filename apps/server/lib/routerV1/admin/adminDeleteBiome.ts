import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { Biome } from '@mhgo/types';

export const adminDeleteBiome = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const adventure = res?.locals?.adventure;
    const { db } = mongoInstance.getDb(adventure);

    const { biomeId } = req.params;

    if (!biomeId) throw new Error('Requested biome does not exist');

    // Delete basic biome info
    const collectionBiomes = db.collection<Biome>('biomes');
    const responseBiomes = await collectionBiomes.deleteOne({
      id: biomeId,
    });
    if (!responseBiomes.acknowledged)
      throw new Error('Could not delete this biome.');

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

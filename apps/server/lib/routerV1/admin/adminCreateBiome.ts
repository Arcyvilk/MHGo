import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Biome } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminCreateBiome = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const biome = req.body as Biome;

    // Check if the biome with this ID already exists
    const newId = biome.name.toLowerCase().replace(/ /g, '_');
    const collectionBiomes = db.collection<Biome>('biomes');
    const biomeWithSameId = await collectionBiomes.findOne({ id: newId });
    if (biomeWithSameId) {
      throw new Error(
        'A biome with this ID already exists! Please change the biome name to generate new biome ID.',
      );
    }

    // Create biome
    const responseBiome = await collectionBiomes.insertOne({
      ...biome,
      id: newId,
      image: biome.image.replace(process.env.CDN_URL, ''),
      thumbnail: biome.thumbnail.replace(process.env.CDN_URL, ''),
    });
    if (!responseBiome.acknowledged) {
      res.status(400).send({ error: 'Could not create this biome.' });
      return;
    }

    // Fin!
    res.status(201).send(responseBiome);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

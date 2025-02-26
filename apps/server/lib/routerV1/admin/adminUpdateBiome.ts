import { Request, Response } from 'express';
import { WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import { Biome } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateBiome = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { biomeId } = req.params;

    const collection = db.collection<Biome>('biomes');
    const { _id, id, image, thumbnail, ...updatedFields } = req.body as Partial<
      WithId<Biome>
    >;

    const response = await collection.updateOne(
      { id: biomeId },
      {
        $set: {
          ...updatedFields,
          thumbnail: thumbnail.replace(process.env.CDN_URL, ''),
          image: image.replace(process.env.CDN_URL, ''),
        },
      },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this biome.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import { Habitat } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateHabitat = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { habitatId } = req.params;

    const collection = db.collection<Habitat>('habitats');
    const { _id, id, image, thumbnail, ...updatedFields } = req.body as Partial<
      WithId<Habitat>
    >;

    const response = await collection.updateOne(
      { id: habitatId },
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
      res.status(400).send({ error: 'Could not update this habitat.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

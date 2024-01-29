import { Request, Response } from 'express';
import { WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import { Resource } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { resourceId } = req.params;

    const collection = db.collection<Resource>('resources');
    const { _id, id, img, thumbnail, ...updatedFields } = req.body as Partial<
      WithId<Resource>
    >;

    const response = await collection.updateOne(
      { id: resourceId },
      {
        $set: {
          ...updatedFields,
          img: img.replace(process.env.CDN_URL, ''),
          thumbnail: thumbnail.replace(process.env.CDN_URL, ''),
        },
      },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this resource.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import { Material } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateMaterial = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { materialId } = req.params;

    const collection = db.collection<Material>('materials');
    const { _id, id, filter, img, ...updatedFields } = req.body as Partial<
      WithId<Material>
    >;

    const response = await collection.updateOne(
      { id: materialId },
      {
        $set: {
          ...updatedFields,
          img: img.replace(process.env.CDN_URL, ''),
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this material.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { WithId } from 'mongodb';
import { log } from '@mhgo/utils';
import { Item } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { itemId } = req.params;

    const collection = db.collection<Item>('items');
    const { _id, craftList, img, ...updatedFields } = req.body as Partial<
      WithId<Item>
    >;

    const response = await collection.updateOne(
      { id: itemId },
      {
        $set: {
          ...updatedFields,
          img: img.replace(process.env.CDN_URL, ''),
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this item.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

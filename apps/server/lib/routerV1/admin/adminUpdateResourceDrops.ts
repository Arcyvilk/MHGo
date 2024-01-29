import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { ResourceDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateResourceDrops = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { resourceId } = req.params;
    const drops = req.body as ResourceDrop['drops'];

    const collection = db.collection<ResourceDrop>('dropsResource');

    const response = await collection.updateOne(
      { resourceId },
      { $set: { drops } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update resource drops.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

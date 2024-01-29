import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { ResourceDrop } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getDropsByResourceId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { resourceId } = req.params;
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const collection = db.collection<ResourceDrop>('dropsResource');

    const resourceDrops = await collection.findOne({ resourceId });

    res.status(200).send(resourceDrops?.drops ?? []);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

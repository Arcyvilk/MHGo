import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Resource } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getResources = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const collection = db.collection<Resource>('resources');
    const resources: Resource[] = [];
    const cursor = collection.find();

    for await (const el of cursor) {
      resources.push(el);
    }

    res.status(200).send(resources);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Habitat } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getHabitats = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Habitat>('habitats');
    const habitats: Habitat[] = [];

    const cursor = collection.find();

    for await (const el of cursor) {
      habitats.push(el);
    }

    res.status(200).send(habitats);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

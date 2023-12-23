import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '../../helpers/log';

export const getHabitats = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection('habitats');
    const habitats = [];

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

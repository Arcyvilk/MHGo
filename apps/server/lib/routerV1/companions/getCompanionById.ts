import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Companion } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getCompanionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { companionId } = req.params;

    if (!companionId) throw new Error('Requested companion does not exist!');

    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const collection = db.collection<Companion>('companions');
    const companion = await collection.findOne({ id: companionId });

    if (!companion) res.sendStatus(404);
    else res.status(200).send(companion);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

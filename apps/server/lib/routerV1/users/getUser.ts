import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    const collection = dbAuth.collection<User>('users');

    const user = await collection.findOne({ id: userId });

    res.status(200).send(user);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminUpdateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;

    const collection = db.collection<User>('users');
    const updatedFields = req.body as Partial<User>;

    const response = await collection.updateOne(
      { id: userId },
      { $set: updatedFields },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this user.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

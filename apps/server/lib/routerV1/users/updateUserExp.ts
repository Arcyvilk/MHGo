import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserExp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const { expChange } = req.body;

    // Get user
    const collectionUsers = db.collection<User>('users');
    const user = await collectionUsers.findOne({
      id: userId,
    });

    const response = await collectionUsers.updateOne(
      { id: userId },
      { $set: { exp: user.exp + expChange } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update users experience.' });
    } else {
      res.sendStatus(200);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

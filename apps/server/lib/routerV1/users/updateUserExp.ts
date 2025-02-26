import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { Setting, UserGameData } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const updateUserExp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const { userId } = req.params;
    const { expChange } = req.body;

    // Get user
    const collectionUsers = db.collection<UserGameData>('users');
    const user = await collectionUsers.findOne({
      id: userId,
    });

    // Calculate new experience and new level
    const collectionSettings = db.collection<Setting<number>>('settings');
    const expPerLevel =
      (
        await collectionSettings.findOne({
          key: 'exp_per_level',
        })
      )?.value ?? 100;
    const oldExp = user.exp;
    const newExp = user.exp + expChange;
    const oldLevel = 1 + Math.floor(oldExp / expPerLevel);
    const newLevel = 1 + Math.floor(newExp / expPerLevel);

    // TODO Give user rewards for when thry level up!

    const response = await collectionUsers.updateOne(
      { id: userId },
      { $set: { exp: newExp } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update users experience.' });
    } else {
      res.status(200).send({ oldExp, newExp, oldLevel, newLevel });
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

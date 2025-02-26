import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User, UserGameData } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const adventure = res?.locals?.adventure;
    const { userId } = req.params;

    const { db } = mongoInstance.getDb(adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    const collectionUsers = dbAuth.collection<User>('users');
    const collectionUsersGameData = db.collection<UserGameData>('users');

    const user = await collectionUsers.findOne({ id: userId });
    const userGameData = await collectionUsersGameData.findOne({ id: userId });

    res.status(200).send({ ...user, ...userGameData });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

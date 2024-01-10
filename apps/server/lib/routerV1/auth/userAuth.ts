import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { UserAuth, UserBan } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    // @ts-expect-error req.user IS defined
    const { userId } = req.user;

    if (!userId) throw new Error('Incorrect user requested');

    const collectionUserAuth = db.collection<UserAuth>('userAuth');
    const userAuth = await collectionUserAuth.findOne({ userId });

    if (!userAuth) throw new Error('Incorrect user requested');

    const collectionUserBan = db.collection<UserBan>('userBans');
    const userBan = (await collectionUserBan.findOne({ userId })) ?? {};

    const censoredUserAuth = {
      userId,
      isAdmin: userAuth.isAdmin,
      isModApproved: userAuth.isModApproved,
      isAwaitingModApproval: userAuth.isAwaitingModApproval,
      ...userBan,
    };
    res.status(200).send(censoredUserAuth);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

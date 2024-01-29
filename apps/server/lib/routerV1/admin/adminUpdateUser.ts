import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User, UserAuth, UserBan } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { WithId } from 'mongodb';

export const adminUpdateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { dbAuth } = mongoInstance.getDb(res.locals.adventure);
    const { userId } = req.params;
    const { user, userBan, userAuth } = req.body as {
      user?: Partial<WithId<User>>;
      userBan?: Partial<WithId<UserBan>>;
      userAuth?: Partial<
        Pick<
          WithId<UserAuth>,
          'isAdmin' | 'isAwaitingModApproval' | 'isModApproved'
        >
      >;
    };

    // Update basic user info
    if (user) {
      const { _id, id, createdAt, ...updatedFields } = user;
      const collectionUsers = dbAuth.collection<User>('users');
      const response = await collectionUsers.updateOne(
        { id: userId },
        { $set: updatedFields },
        { upsert: true },
      );

      if (!response.acknowledged)
        throw new Error('Could not update this user.');
    }

    // Update user auth info
    if (userAuth) {
      const collectionAuth = dbAuth.collection<UserAuth>('userAuth');
      const response = await collectionAuth.updateOne(
        { userId },
        { $set: userAuth },
        { upsert: true },
      );

      if (!response.acknowledged)
        throw new Error('Could not update this user.');
    }

    // Update user ban info
    if (userBan) {
      const collectionBans = dbAuth.collection<UserBan>('userBans');
      const response = await collectionBans.updateOne(
        { userId },
        { $set: userBan },
        { upsert: true },
      );

      if (!response.acknowledged)
        throw new Error('Could not update this user.');
    }

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

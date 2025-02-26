import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User, UserAuth, UserBan, UserGameData } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { WithId } from 'mongodb';

export const adminUpdateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const adventure = res?.locals?.adventure;
    const { db } = mongoInstance.getDb(adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    const { userId } = req.params;
    const { user, userGameData, userBan, userAuth } = req.body as {
      user?: Partial<WithId<User>>;
      userGameData?: Partial<WithId<UserGameData>>;
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

    // Update user's adventure specific basic data
    if (userGameData) {
      const { _id, id, ...updatedFields } = userGameData;
      const collectionUserGameData = db.collection<UserGameData>('users');
      const response = await collectionUserGameData.updateOne(
        { id: userId },
        { $set: updatedFields },
        { upsert: true },
      );

      if (!response.acknowledged)
        throw new Error("Could not update this user's game data.");
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
      // TODO Add legit reason and end date for ban
      const userBanAllData = {
        ...userBan,
        userId,
        banReason: 'Because yes',
        banEndDate: new Date(32475321603000),
      };
      const collectionBans = dbAuth.collection<UserBan>('userBans');
      const response = await collectionBans.updateOne(
        { userId },
        { $set: userBanAllData },
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

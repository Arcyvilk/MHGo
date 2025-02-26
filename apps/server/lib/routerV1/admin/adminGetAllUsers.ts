import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User, UserAuth, UserBan, UserGameData } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminGetAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const adventure = res?.locals?.adventure;
    const { db } = mongoInstance.getDb(adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    // Get list of users
    const collectionUsers = dbAuth.collection<User>('users');
    const users = await collectionUsers.find().toArray();

    // Get list of users' adventure data
    const collectionUserGameData = db.collection<UserGameData>('users');
    const usersGameData = await collectionUserGameData.find().toArray();

    // Get list of users' bans
    const collectionUserBans = dbAuth.collection<UserBan>('userBans');
    const usersBans = await collectionUserBans.find().toArray();

    // Get list of users' auth
    const collectionUserAuth = dbAuth.collection<UserAuth>('userAuth');
    const usersAuth = await collectionUserAuth.find().toArray();

    // Merge everything into one
    const mergedUsers = users.map(user => {
      const userAuth = usersAuth.find(u => u.userId === user.id);
      const userBan = usersBans.find(u => u.userId === user.id);
      const userGameData = usersGameData.find(u => u.id === user.id);

      return {
        ...user,
        ...userGameData,
        userBan,
        isAdmin: userAuth.isAdmin,
        isAwaitingModApproval: userAuth.isAwaitingModApproval,
        isModApproved: userAuth.isModApproved,
      };
    });

    res.status(200).send(mergedUsers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

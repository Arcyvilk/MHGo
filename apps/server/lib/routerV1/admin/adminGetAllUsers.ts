import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User, UserAuth, UserBan } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminGetAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { dbAuth } = mongoInstance.getDbAuth();

    // Get list of users
    const collectionUsers = dbAuth.collection<User>('users');
    const users: User[] = [];
    const cursorUsers = collectionUsers.find();

    for await (const el of cursorUsers) {
      users.push(el);
    }

    // Get list of users' bans
    const collectionUserBans = dbAuth.collection<UserBan>('userBans');
    const usersBans: UserBan[] = [];
    const cursorUserBans = collectionUserBans.find();

    for await (const el of cursorUserBans) {
      usersBans.push(el);
    }

    // Get list of users' auth
    const collectionUserAuth = dbAuth.collection<UserAuth>('userAuth');
    const usersAuth: UserAuth[] = [];
    const cursorUserAuth = collectionUserAuth.find();

    for await (const el of cursorUserAuth) {
      usersAuth.push(el);
    }

    // Merge everything into one
    const mergedUsers = users.map(user => {
      const userAuth = usersAuth.find(u => u.userId === user.id);
      const userBan = usersBans.find(u => u.userId === user.id);

      return {
        ...user,
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

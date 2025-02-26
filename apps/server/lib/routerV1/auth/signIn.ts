import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, response, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import {
  User,
  UserItems,
  UserAuth,
  UserLoadout,
  UserWealth,
  UserBan,
} from '@mhgo/types';
import { Db } from 'mongodb';
import { getStarterPack } from '../../helpers/getStarterPack';

const saltRounds = 10; //required by bcrypt

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, email, pwd } = req.body;

    if (!userName || !pwd) throw new Error('User credentials missing!');

    const { dbAuth } = mongoInstance.getDbAuth();

    // Create new user login
    const privateKey = process.env.PRIVATE_KEY;
    const pwdHash = await bcrypt.hash(pwd, saltRounds);
    const userId =
      userName.toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '') + Date.now();
    const newUserLogin: UserAuth = {
      userId,
      pwdHash,
      email,
      isAdmin: false,
      isAwaitingModApproval: true,
      isModApproved: false,
    };

    // Check if the username is not taken
    const collectionUsers = dbAuth.collection<User>('users');
    const sameUsernameUser = await collectionUsers.findOne({ name: userName });
    if (sameUsernameUser) {
      throw new Error('This username is already taken!');
    }

    // Save new user credentials to database
    const collectionLogin = dbAuth.collection<UserAuth>('userAuth');
    const responseSignIn = await collectionLogin.insertOne(newUserLogin);

    if (!responseSignIn.acknowledged) {
      throw new Error('Could not register the new user!');
    }

    // Create basic user data
    const responseNewUser = await createNewUser(dbAuth, userId, userName);
    if (!responseNewUser.acknowledged) {
      throw new Error('Could not register the new user!');
    }

    /**
     * User needs to be created separately for every adventure.
     * In the future it would be nice to allow user which adventures to join
     * instead of automatically creating one for all of them.
     */

    const adventures = Object.keys(mongoInstance.adventureDbs);

    adventures.forEach(async adventure => {
      const { db } = mongoInstance.getDb(adventure);

      // Give user the starter pack
      const responseStarterPack = await giveUserStarterPack(
        db,
        userId,
        adventure,
      );
      if (!responseStarterPack.acknowledged) {
        throw new Error('Could not give user the starter pack!');
      }
    });

    const token = await jwt.sign({ userId, isAdmin: false }, privateKey, {
      expiresIn: '7d',
    });

    setTimeout(() => {
      if (!token) {
        res.sendStatus(401);
      } else {
        res.json({ userId, token });
      }
    }, 2000);
  } catch (err) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

const createNewUser = async (dbAuth: Db, userId: string, userName: string) => {
  const newUser: User = {
    name: userName,
    avatar: '/misc/avatar.png',
    id: userId,
    createdAt: new Date(),
  };
  const collectionUsers = dbAuth.collection<Omit<User, 'progress'>>('users');
  const responseUsers = await collectionUsers.insertOne(newUser);

  const newUserBanInfo: UserBan = {
    userId,
    banEndDate: new Date(),
    banReason: 'Because yes',
    isBanned: false,
  };

  const collectionBans = dbAuth.collection<UserBan>('userBans');
  await collectionBans.insertOne(newUserBanInfo);

  return responseUsers;
};

const giveUserStarterPack = async (
  db: Db,
  userId: string,
  adventure: string,
) => {
  // Get starter pack
  const starterPack = await getStarterPack(adventure, 'starter');
  const starterPackItems = starterPack
    .filter(entity => entity.entityType === 'item')
    .map(entity => ({
      id: entity.entityId,
      amount: entity.amount,
    }));

  // Give items
  const userItems: UserItems = {
    userId,
    items: starterPackItems,
  };

  const collectionItems = db.collection<UserItems>('userItems');
  const responseItems = await collectionItems.insertOne(userItems);

  // Equip items
  const userLoadout: UserLoadout = {
    userId,
    loadout: [
      {
        slot: 'weapon',
        itemId: 'bare_fist',
      },
    ],
  };

  const collectionLoadout = db.collection<UserLoadout>('userLoadout');
  const responseLoadout = await collectionLoadout.insertOne(userLoadout);

  // Add wealth
  const userWealth: UserWealth = {
    userId,
    wealth: [
      {
        id: 'base',
        amount: 0,
      },
      {
        id: 'premium',
        amount: 0,
      },
    ],
  };

  const collectionWealth = db.collection<UserWealth>('userWealth');
  const responseWealth = await collectionWealth.insertOne(userWealth);

  return {
    acknowledged:
      responseItems.acknowledged &&
      responseLoadout.acknowledged &&
      responseWealth.acknowledged,
  };
};

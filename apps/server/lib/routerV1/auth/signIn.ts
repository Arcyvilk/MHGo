import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';
import { User, UserItems, UserAuth, UserLoadout } from '@mhgo/types';
import { Db } from 'mongodb';

const saltRounds = 10; //required by bcrypt

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, email, pwd } = req.body;

    if (!userName || !pwd) throw new Error('User credentials missing!');
    const { db } = mongoInstance.getDb();

    // Create new user login
    const privateKey = process.env.PRIVATE_KEY;
    const pwdHash = await bcrypt.hash(pwd, saltRounds);
    const userId =
      userName.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '') + Date.now();
    const newUserLogin: UserAuth = {
      userId,
      pwdHash,
      email,
      isAdmin: false,
      isAwaitingModApproval: true,
      isModApproved: false,
    };

    // Check if the username is not taken
    const collectionUsers = db.collection<User>('users');
    const sameUsernameUser = await collectionUsers.findOne({ name: userName });
    if (sameUsernameUser) {
      throw new Error('This username is already taken!');
    }

    // Save new user credentials to database
    const collectionLogin = db.collection<UserAuth>('userAuth');
    const responseSignIn = await collectionLogin.insertOne(newUserLogin);

    if (!responseSignIn.acknowledged) {
      throw new Error('Could not register the new user!');
    }

    // Create basic user data
    const responseNewUser = await createNewUser(db, userId, userName);
    if (!responseNewUser.acknowledged) {
      throw new Error('Could not register the new user!');
    }

    // Give user the starter pack
    const responseStarterPack = await giveUserStarterPack(db, userId);
    if (!responseStarterPack.acknowledged) {
      throw new Error('Could not give user the starter pack!');
    }

    const token = await jwt.sign({ userId }, privateKey, {
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

const createNewUser = async (db: Db, userId: string, userName: string) => {
  const newUser: User = {
    name: userName,
    avatar: '/misc/avatar.png',
    exp: 0,
    id: userId,
    wounds: 0,
    createdAt: new Date(),
  };
  const collection = db.collection<Omit<User, 'progress'>>('users');
  const response = await collection.insertOne(newUser);

  return response;
};

const giveUserStarterPack = async (db: Db, userId: string) => {
  // Give items
  const userItems: UserItems = {
    userId,
    items: [
      {
        id: 'bare_fist',
        amount: 1,
      },
      {
        id: 'potion',
        amount: 10,
      },
    ],
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

  return {
    acknowledged: responseItems.acknowledged && responseLoadout.acknowledged,
  };
};

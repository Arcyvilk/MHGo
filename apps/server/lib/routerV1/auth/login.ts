import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { log } from '@mhgo/utils';
import { User, UserAuth } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, pwd } = req.body;
    let token = null;

    if (!userName || !pwd) throw new Error('User credentials missing!');

    // Get basic user data
    const { dbAuth } = mongoInstance.getDbAuth();

    const collectionUsers = dbAuth.collection<User>('users');
    const user = await collectionUsers.findOne({ name: userName });
    if (!user) throw new Error('Invalid credentials!');

    // Get user's credentials
    const userId = user.id;
    const privateKey = process.env.PRIVATE_KEY;
    const collectionLogin = dbAuth.collection<UserAuth>('userAuth');
    const { pwdHash, isAdmin } = await collectionLogin.findOne({ userId });

    const match = await bcrypt.compare(pwd, pwdHash);
    if (!match) throw new Error('Invalid credentials!');

    token = await jwt.sign({ userId, isAdmin }, privateKey, {
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
    setTimeout(() => {
      res.status(500).send({ error: err.message ?? 'Internal server error' });
    }, 2000);
  }
};

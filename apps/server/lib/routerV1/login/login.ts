import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User, UserLogin } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, pwd } = req.body;
    let token = null;

    if (!userName || !pwd) throw new Error('User credentials missing!');

    // Get basic user data
    const { db } = mongoInstance.getDb();
    const collectionUsers = db.collection<User>('users');
    const user = await collectionUsers.findOne({ name: userName });
    if (!user) throw new Error('This user does not exist!');

    // Get user's credentials
    const userId = user.id;
    const privateKey = process.env.PRIVATE_KEY;
    const collectionLogin = db.collection<UserLogin>('login');
    const { pwdHash } = await collectionLogin.findOne({ userId });

    const match = await bcrypt.compare(pwd, pwdHash);
    if (!match) throw new Error('Incorrect credentials!');

    token = await jwt.sign({ userId }, privateKey, {
      expiresIn: '24h',
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

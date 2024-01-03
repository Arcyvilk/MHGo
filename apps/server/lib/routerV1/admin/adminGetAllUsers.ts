import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { User } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminGetAllUsers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<User>('users');
    const users: User[] = [];
    const cursor = collection.find();

    for await (const el of cursor) {
      users.push(el);
    }

    res.status(200).send(users);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

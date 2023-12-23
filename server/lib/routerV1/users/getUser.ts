import { Request, Response } from 'express';

import { mongoInstance } from '../../../api';
import { log } from '../../helpers/log';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb();
    const collection = db.collection('users');
    const users = [];

    const cursor = collection.find({ id: userId });

    for await (const el of cursor) {
      users.push(el);
    }

    res.status(200).send(users);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

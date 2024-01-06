import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  User,
  UserItems,
  UserLoadout,
  UserMaterials,
  UserRespawn,
  UserWealth,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminResetUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;

    if (!userId) throw new Error('No user ID provided!');

    // Reset user's exp, wounds
    const collectionUsers = db.collection<User>('users');
    const response = await collectionUsers.updateOne(
      { id: userId },
      { $set: { exp: 0, wounds: 0 } },
    );

    // Reset user's items
    const collectionItems = db.collection<UserItems>('userItems');
    await collectionItems.updateOne(
      { userId },
      { $set: { items: [] } },
      { upsert: true },
    );

    // Reset user's loadout
    const collectionLoadout = db.collection<UserLoadout>('userLoadout');
    await collectionLoadout.updateOne(
      { userId },
      { $set: { loadout: [] } },
      { upsert: true },
    );

    // Reset user's materials
    const collectionMats = db.collection<UserMaterials>('userMaterials');
    await collectionMats.updateOne(
      { userId },
      { $set: { materials: [] } },
      { upsert: true },
    );

    // Reset user's wealth
    const collectionWealth = db.collection<UserWealth>('userWealth');
    await collectionWealth.updateOne(
      { userId },
      { $set: { wealth: [] } },
      { upsert: true },
    );

    // Reset user's respawn points
    const collectionRespawn = db.collection<UserRespawn>('userRespawn');
    await collectionRespawn.deleteMany({ userId });

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

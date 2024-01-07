import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  User,
  UserItems,
  UserLoadout,
  UserMaterials,
  UserResetType,
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
    const toReset = req.body as UserResetType;

    if (!userId) throw new Error('No user ID provided!');

    // Reset user's exp, wounds
    if (toReset.basic) {
      const collectionUsers = db.collection<User>('users');
      await collectionUsers.updateOne(
        { id: userId },
        { $set: { exp: 0, wounds: 0 } },
      );
    }

    // Reset user's items
    if (toReset.items) {
      const collectionItems = db.collection<UserItems>('userItems');
      await collectionItems.updateOne(
        { userId },
        { $set: { items: [] } },
        { upsert: true },
      );
    }

    // Reset user's loadout
    if (toReset.loadout) {
      const collectionLoadout = db.collection<UserLoadout>('userLoadout');
      await collectionLoadout.updateOne(
        { userId },
        { $set: { loadout: [] } },
        { upsert: true },
      );
    }

    // Reset user's materials
    if (toReset.materials) {
      const collectionMats = db.collection<UserMaterials>('userMaterials');
      await collectionMats.updateOne(
        { userId },
        { $set: { materials: [] } },
        { upsert: true },
      );
    }

    // Reset user's wealth
    if (toReset.wealth) {
      const collectionWealth = db.collection<UserWealth>('userWealth');
      await collectionWealth.updateOne(
        { userId },
        { $set: { wealth: [] } },
        { upsert: true },
      );
    }

    // Reset user's respawn points
    if (toReset.cooldowns) {
      const collectionRespawn = db.collection<UserRespawn>('userRespawn');
      await collectionRespawn.deleteMany({ userId });
    }

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

export const adminUserEnableGodmode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;

    if (!userId) throw new Error('No user ID provided!');

    const collectionUserItems = db.collection<UserItems>('userItems');
    const userItems =
      (await collectionUserItems.findOne({ userId }))?.items ?? [];

    const response = await collectionUserItems.updateOne(
      { userId },
      {
        $set: {
          items: [
            ...userItems,
            {
              id: 'soatt',
              amount: 1,
            },
            {
              id: 'potion',
              amount: 999,
            },
          ],
        },
      },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not give user OP items :C' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

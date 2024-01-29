import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';

export const adminDeleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    const { userId } = req.params;

    if (!userId) throw new Error('Requested user does not exist');

    // Delete basic user info
    const collectionUsers = dbAuth.collection('users');
    const responseUser = await collectionUsers.deleteOne({ id: userId });
    if (!responseUser.acknowledged)
      throw new Error('Could not delete this user.');

    // Delete user auth info
    const collectionAuth = dbAuth.collection('userAuth');
    const responseAuth = await collectionAuth.deleteOne({ userId });
    if (!responseAuth.acknowledged)
      throw new Error('Could not delete this user.');

    // Delete user achievements
    const collectionAchievements = db.collection('userAchievements');
    await collectionAchievements.deleteOne({ userId });

    // Delete user ban info
    const collectionBans = dbAuth.collection('userBans');
    await collectionBans.deleteOne({ userId });

    // Delete user items
    const collectionItems = db.collection('userItems');
    await collectionItems.deleteOne({ userId });

    // Delete user loadout
    const collectionLoadout = db.collection('userLoadout');
    await collectionLoadout.deleteOne({ userId });

    // Delete user materials
    const collectionMaterials = db.collection('userMaterials');
    await collectionMaterials.deleteOne({ userId });

    // Delete user quests
    const collectionQuests = db.collection('userQuests');
    await collectionQuests.deleteOne({ userId });

    // Delete user daily quests
    const collectionDailyQuests = db.collection('userQuestsDaily');
    await collectionDailyQuests.deleteOne({ userId });

    // Delete user respawn timers
    const collectionRespawn = db.collection('userRespawn');
    await collectionRespawn.deleteOne({ userId });

    // Delete user wealth
    const collectionWealth = db.collection('userWealth');
    await collectionWealth.deleteOne({ userId });

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

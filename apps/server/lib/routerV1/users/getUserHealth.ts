import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { BaseStats, ItemStat, Setting, User, UserLoadout } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { getSumOfStat } from '../../helpers/getSumOfStats';

export const getUserHealth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);
    const { dbAuth } = mongoInstance.getDbAuth();

    const { userId } = req.params;

    // Get base stats of every user
    const collectionSettings = db.collection<Setting<BaseStats>>('settings');
    const { value: baseStats } = await collectionSettings.findOne({
      key: 'base_stats',
    });

    // Get requested user's loadout
    const collectionUserLoadouts = db.collection<UserLoadout>('userLoadout');
    const userLoadout = await collectionUserLoadouts.findOne({ userId });
    const loadoutIds = (userLoadout?.loadout ?? []).map(slot => slot.itemId);

    // Get stats of items from user's loadout
    const collectionItemStats = db.collection<ItemStat>('itemStats');
    const itemStats: ItemStat[] = await collectionItemStats
      .find({
        itemId: { $in: loadoutIds },
      })
      .toArray();

    // Get user's current max HP
    const health = await getSumOfStat(db, baseStats, itemStats, 'health');

    // Get user's current wounds
    const collectionUsers = dbAuth.collection<User>('users');
    const user = await collectionUsers.findOne({ id: userId });
    const wounds = user.wounds;

    res.status(200).send({
      maxHealth: health,
      currentHealth: health + wounds,
    });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

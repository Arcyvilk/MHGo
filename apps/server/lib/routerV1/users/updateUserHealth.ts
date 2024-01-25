import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { BaseStats, ItemStat, Setting, User, UserLoadout } from '@mhgo/types';

import { mongoInstance } from '../../../api';
import { getSumOfStat } from '../../helpers/getSumOfStats';

export const updateUserHealth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const { userId } = req.params;
    const { healthChange } = req.body;

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
    const collectionUsers = db.collection<User>('users');
    const user = await collectionUsers.findOne({ id: userId });

    const wounds = getUpdatedWounds(health, user.wounds, healthChange);

    const response = await collectionUsers.updateOne(
      { id: userId },
      { $set: { wounds } },
      { upsert: true },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update users health.' });
    } else {
      res.sendStatus(200);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

const getUpdatedWounds = (
  maxHealth: number,
  currentWounds: number,
  healthChange: number,
) => {
  const newWounds = currentWounds + healthChange;

  if (newWounds > 0) return 0;
  if (newWounds < -maxHealth) return -maxHealth;
  return newWounds;
};

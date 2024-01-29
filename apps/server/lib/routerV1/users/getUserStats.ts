import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  BaseStats,
  ItemStat,
  Setting,
  StatsWithSpecialEffect,
  UserLoadout,
} from '@mhgo/types';

import { mongoInstance } from '../../../api';
import {
  getSumOfSpecialEffects,
  getSumOfStat,
} from '../../helpers/getSumOfStats';

export const getUserStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { db } = mongoInstance.getDb(res.locals.adventure);

    // Get base stats of every user
    const collectionSettings = db.collection<Setting<unknown>>('settings');
    const { value: baseStats } = (await collectionSettings.findOne({
      key: 'base_stats',
    })) as { value: BaseStats };
    const { value: specialEffectMaxPoints = 5 } =
      (await collectionSettings.findOne({
        key: 'special_effect_max_points',
      })) as { value: number };

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

    // Sum all of the stats from all of the items
    const userStats: StatsWithSpecialEffect = {
      attack: await getSumOfStat(db, baseStats, itemStats, 'attack'),
      defense: await getSumOfStat(db, baseStats, itemStats, 'defense'),
      health: await getSumOfStat(db, baseStats, itemStats, 'health'),
      luck: await getSumOfStat(db, baseStats, itemStats, 'luck'),
      critChance: await getSumOfStat(db, baseStats, itemStats, 'critChance'),
      critDamage: await getSumOfStat(db, baseStats, itemStats, 'critDamage'),
      specialEffects: await getSumOfSpecialEffects(
        db,
        specialEffectMaxPoints,
        itemStats,
        'specialEffects',
      ),
      element: 'none', // TODO implement element
    };

    res.status(200).send(userStats);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

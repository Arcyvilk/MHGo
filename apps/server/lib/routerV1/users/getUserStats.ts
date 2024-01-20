import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import {
  BaseStats,
  ItemEffect,
  ItemStat,
  Setting,
  Stats,
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
    const { db } = mongoInstance.getDb();

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
    const itemStats: Stats[] = [];
    const cursorItemStats = collectionItemStats.find({
      itemId: { $in: loadoutIds },
    });
    for await (const el of cursorItemStats) {
      itemStats.push(el.stats);
    }

    // Sum all of the stats from all of the items
    const userStats: Omit<Stats, 'specialEffects'> & {
      specialEffects: Record<ItemEffect, number>;
    } = {
      attack: getSumOfStat(baseStats, itemStats, 'attack'),
      defense: getSumOfStat(baseStats, itemStats, 'defense'),
      health: getSumOfStat(baseStats, itemStats, 'health'),
      luck: getSumOfStat(baseStats, itemStats, 'luck'),
      critChance: getSumOfStat(baseStats, itemStats, 'critChance'),
      critDamage: getSumOfStat(baseStats, itemStats, 'critDamage'),
      specialEffects: getSumOfSpecialEffects(itemStats, 'specialEffects'),
      element: 'none', // TODO implement element
    };

    res.status(200).send(userStats);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

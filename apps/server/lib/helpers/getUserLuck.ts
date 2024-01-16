import { Db } from 'mongodb';
import { BaseStats, ItemStat, Setting, Stats, UserLoadout } from '@mhgo/types';

import { getSumOfStat } from './getSumOfStats';

export const getUserLuck = async (userId: string, db: Db) => {
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
  const luck = getSumOfStat(baseStats, itemStats, 'luck');
  return { luck };
};

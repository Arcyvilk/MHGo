import { Db } from 'mongodb';
import { BaseStats, ItemStat, Setting, UserLoadout } from '@mhgo/types';

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
  const itemStats: ItemStat[] = await collectionItemStats
    .find({
      itemId: { $in: loadoutIds },
    })
    .toArray();

  // Sum all of the stats from all of the items
  const luck = await getSumOfStat(db, baseStats, itemStats, 'luck');
  return { luck };
};

import { BaseStats, ItemEffect, Stats } from '@mhgo/types';

export const getSumOfStat = (
  baseStats: BaseStats,
  itemStats: Stats[],
  statType: keyof Omit<Stats, 'element' | 'specialEffects'>,
) => {
  return itemStats
    .filter(stat => stat[statType])
    .reduce((sum, curr) => sum + curr[statType], baseStats[statType]);
};

export const getSumOfSpecialEffects = (
  itemStats: Stats[],
  statType: keyof Pick<Stats, 'specialEffects'>,
) => {
  // This is ugly af so I'm going to explain a little bit.
  return (
    itemStats
      // We iterate through all items that user has equipped and get only "specialEffects" from their stats.
      .map(stat => stat[statType])
      // Then we filter out those that have no special effects at all.
      .filter(stat => stat.length)
      // Then we flatten the result so we have array of strings representing the special effect
      .flat()
      // And then we sum all of the special effects so we know how many points user has into a special effect.
      // However, user cannot have more than 5 points into a single effect (that's to copy how MH does it
      // and also to prevent more OP builds that I haven't anticipated because to be fair, balance
      // is harder work for me than coding all that shit)
      .reduce((sum, curr) => {
        const pointsIntoEffect = getPointsOfEffect(sum[curr]);
        return {
          ...sum,
          [curr]: pointsIntoEffect,
        };
      }, {}) as Record<ItemEffect, number>
  );
};

const getPointsOfEffect = (prevPoints: number) => {
  // If another item gave this exact effect before...
  if (prevPoints) {
    // ...we either cap it at 5...
    if (prevPoints >= 5) return 5;
    // ...or if it's less than 5, we just increment by 1
    else return prevPoints + 1;
  }
  // If this is the first item giving this kinda effect, points into his effect is just 1
  else return 1;
};

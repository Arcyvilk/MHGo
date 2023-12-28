import { BaseStats, Stats } from '@mhgo/types';

export const getSumOfStat = (
  baseStats: BaseStats,
  itemStats: Stats[],
  statType: keyof Omit<Stats, 'element'>,
) => {
  return itemStats
    .filter(stat => stat[statType])
    .reduce((sum, curr) => sum + curr[statType], baseStats[statType]);
};

import { randomNumberBetween } from '@mhgo/utils';
import type { User } from '@mhgo/types';

export const getUserLevel = (user: User | null, expPerLevel: number) => {
  const userExp = user?.exp ?? 0;
  const userLevel = 1 + Math.floor(userExp / expPerLevel);
  return userLevel;
};

export const determineMonsterLevel = (userLevel: number) => {
  return randomNumberBetween(1, userLevel > 10 ? 5 : Math.floor(userLevel / 2));
};

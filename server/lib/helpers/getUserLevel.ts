import { randomNumberBetween } from './rng';

type User = any; // TODO get this type from client

export const getUserLevel = (user: User, expPerLevel: number) => {
  const userLevel = 1 + Math.floor((user?.exp ?? 0) / expPerLevel);
  return userLevel;
};

export const determineMonsterLevel = (userLevel: number) => {
  return randomNumberBetween(1, userLevel > 5 ? 5 : userLevel);
};

import type { UserGameData } from '@mhgo/types';

export const getUserLevel = (
  user: UserGameData | null,
  expPerLevel: number,
) => {
  const userExp = user?.exp ?? 0;
  const userLevel = 1 + Math.floor(userExp / expPerLevel);
  return userLevel;
};

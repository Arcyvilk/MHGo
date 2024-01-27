import { randomNumberBetween } from '@mhgo/utils';

export const determineMonsterLevel = (userLevel: number) => {
  const params = new URLSearchParams(location.search);
  const level = params.get('level');
  const randomMonsterLevel = randomNumberBetween(
    1,
    userLevel > 10 ? 5 : Math.floor(userLevel / 2),
  );

  return level ? Number(level) : randomMonsterLevel;
};

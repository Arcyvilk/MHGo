import { randomNumberBetween } from '@mhgo/utils';

export const determineMonsterLevel = (userLevel: number) => {
  const params = new URLSearchParams(location.search);
  const level = params.get('level');
  const randomMonsterLevel = randomNumberBetween(
    1,
    userLevel > 5 ? 5 : userLevel,
  );

  return level ? Number(level) : randomMonsterLevel;
};

import seedrandom from 'seedrandom';

// RANDOM
export const draw = (): number => Math.floor(Math.random() * 100 + 1);

export const chooseRandom = <T>(list: Array<T>): T =>
  list[Math.floor(Math.random() * list.length)];

export const randomNumberBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const happensWithAChanceOf = (percentageChance: number): boolean =>
  draw() <= percentageChance ? true : false;

export const randomizeWithinBounds = (
  list: { id: string; chance: number }[],
) => {
  const allChances = getRandomBounds(list);
  const random = randomNumberBetween(0, 100);
  const chosen = allChances.find(
    item => item.randomBounds[0] <= random && item.randomBounds[1] >= random,
  );
  return chosen;
};

// SEEDED

export const drawSeeded = (seed: string | number): number => {
  const seededRand = seedrandom(String(seed));
  return Math.floor(seededRand() * 100 + 1);
};

export const chooseRandomSeeded = <T>(
  list: Array<T>,
  seed: string | number,
): T => {
  const seededRand = seedrandom(String(seed));
  return list[Math.floor(seededRand() * list.length)];
};

export const happensWithAChanceOfSeeded = (
  percentageChance: number,
  seed: string | number,
): boolean => (drawSeeded(seed) <= percentageChance ? true : false);

export const randomNumberBetweenSeeded = (
  min: number,
  max: number,
  seed: string | number,
) => {
  const seededRand = seedrandom(String(seed));
  return Math.floor(seededRand() * (max - min + 1) + min);
};

export const randomizeWithinBoundsSeeded = (
  list: { id: string; chance: number }[],
  seed: string | number,
) => {
  const allChances = getRandomBounds(list);
  const random = randomNumberBetweenSeeded(0, 100, seed);
  const chosen = allChances.find(
    item => item.randomBounds[0] <= random && item.randomBounds[1] >= random,
  );
  return chosen;
};

// OTHER

export const getRandomBounds = (list: { id: string; chance: number }[]) => {
  const chanceBounds = list.map((item, index) => {
    const prevChances =
      index === 0
        ? 0
        : list.slice(0, index).reduce((acc, item) => acc + item.chance, 0);
    const randomBounds = [
      prevChances === 0 ? 0 : prevChances + 1,
      item.chance + prevChances,
    ];
    return { ...item, randomBounds };
  });
  return chanceBounds;
};

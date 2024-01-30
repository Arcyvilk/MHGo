export const draw = (): number => Math.floor(Math.random() * 100 + 1);

export const happensWithAChanceOf = (percentageChance: number): boolean =>
  draw() <= percentageChance ? true : false;

export const chooseRandom = <T>(list: Array<T>): T =>
  list[Math.floor(Math.random() * list.length)];

export const randomNumberBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomizeWithinBounds = (
  list: { id: string; chance: number }[],
) => {
  const allChances = list.map((item, index) => {
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
  const random = randomNumberBetween(0, 100);
  const chosen = allChances.find(
    item => item.randomBounds[0] <= random && item.randomBounds[1] >= random,
  );
  return chosen!.id;
};

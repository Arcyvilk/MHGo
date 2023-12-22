export const draw = (): number => Math.floor(Math.random() * 100 + 1);

export const happensWithAChanceOf = (percentageChance: number): boolean =>
  draw() <= percentageChance ? true : false;

export const chooseRandom = <T>(list: Array<T>): T =>
  list[Math.floor(Math.random() * list.length)];

export const randomNumberBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

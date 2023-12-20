export type UserWealth = {
  id: string;
  amount: number;
};
export type UserItem = {
  id: string;
  amount: number;
};
export const userWealth: { userId: string; wealth: UserWealth[] }[] = [
  {
    userId: '1',
    wealth: [
      {
        id: 'money',
        amount: 66666,
      },
      {
        id: 'lapki',
        amount: 12,
      },
    ],
  },
];

export const userItems: { userId: string; items: UserItem[] }[] = [
  {
    userId: '1',
    items: [
      { id: 'potion', amount: 7 },
      { id: 'paintball', amount: 16 },
      { id: 'bomb', amount: 1 },
      { id: 'steak', amount: 20 },
      { id: 'pitfall', amount: 4 },
    ],
  },
];

export const userMaterials: { userId: string; materials: UserItem[] }[] = [
  {
    userId: '1',
    materials: [
      { id: 'claw1', amount: 749 },
      { id: 'claw2', amount: 441 },
      { id: 'claw3', amount: 70 },
      { id: 'fin1', amount: 229 },
      { id: 'fin4', amount: 12 },
      { id: 'fin3', amount: 6 },
      { id: 'hide1', amount: 530 },
      { id: 'hide2', amount: 499 },
      { id: 'bug1', amount: 12 },
      { id: 'bug5', amount: 1 },
      { id: 'scale1', amount: 429 },
      { id: 'scale2', amount: 221 },
      { id: 'scale3', amount: 89 },
      { id: 'scale4', amount: 20 },
      { id: 'scale5', amount: 4 },
    ],
  },
];

export const userData = [
  {
    userId: '1',
    exp: 0,
    progress: {
      chapter: '1',
      quest: '1',
    },
  },
];

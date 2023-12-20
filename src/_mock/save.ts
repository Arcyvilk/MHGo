export const MOCK_USER_ID = '1';

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
      {
        id: 'potion',
        amount: 7,
      },
      {
        id: 'paintball',
        amount: 16,
      },
      {
        id: 'bomb',
        amount: 1,
      },
      {
        id: 'steak',
        amount: 20,
      },
      {
        id: 'pitfall',
        amount: 4,
      },
    ],
  },
];

export const userProgress = [
  {
    userId: '1',
    progress: {
      chapter: '1',
      quest: '1',
    },
  },
];

import { UserItems, UserMaterials, UserWealth } from '../api';

export const userWealth: UserWealth[] = [
  {
    userId: 'TESTER',
    wealth: [
      { id: 'money', amount: 0 },
      { id: 'lapki', amount: 0 },
    ],
  },
];

export const userItems: UserItems[] = [
  {
    userId: 'TESTER',
    items: [
      { id: 'potion', amount: 7 },
      { id: 'paintball', amount: 0 },
      { id: 'bomb', amount: 1 },
      { id: 'steak', amount: 20 },
      { id: 'pitfall', amount: 4 },
    ],
  },
];

export const userMaterials: UserMaterials[] = [
  {
    userId: 'TESTER',
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
    userId: 'TESTER',
    exp: 1000,
    progress: {
      chapter: '1',
      quest: '1',
    },
  },
];

export type LoadoutType =
  | 'weapon'
  | 'helmet'
  | 'torso'
  | 'gloves'
  | 'hips'
  | 'legs';

export type UserLoadout = {
  userId: string;
  loadout: { slot: LoadoutType; itemId: string }[];
};

export const userLoadout: UserLoadout[] = [
  {
    userId: 'TESTER',
    loadout: [
      {
        slot: 'weapon',
        itemId: 'dullblade',
      },
      {
        slot: 'helmet',
        itemId: 'bucket',
      },
    ],
  },
];

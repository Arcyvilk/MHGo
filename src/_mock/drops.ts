export type Drop = {
  materialId: string; // ID of the material to drop
  chance: number; // from 0 to 100
  amount: number; // how many of those can drop
};

export type MonsterDrop = {
  monsterId: string; // ID of the monster that drops this
  drops: {
    level: number;
    drops: Drop[];
  }[];
};

export const monsterDrops: MonsterDrop[] = [
  {
    monsterId: 'angrybird',
    drops: [
      {
        level: 1,
        drops: [
          {
            materialId: 'claw1',
            chance: 80,
            amount: 4,
          },
          {
            materialId: 'claw2',
            chance: 50,
            amount: 2,
          },
          {
            materialId: 'claw3',
            chance: 5,
            amount: 1,
          },
        ],
      },
    ],
  },
  {
    monsterId: 'babcianiath',
    drops: [
      {
        level: 1,
        drops: [
          {
            materialId: 'claw1',
            chance: 100,
            amount: 1,
          },
        ],
      },
    ],
  },
  {
    monsterId: 'babcioth',
    drops: [
      {
        level: 1,
        drops: [
          {
            materialId: 'claw1',
            chance: 100,
            amount: 1,
          },
        ],
      },
    ],
  },
  {
    monsterId: 'businessnath',
    drops: [
      {
        level: 1,
        drops: [
          {
            materialId: 'claw1',
            chance: 100,
            amount: 1,
          },
        ],
      },
    ],
  },
];

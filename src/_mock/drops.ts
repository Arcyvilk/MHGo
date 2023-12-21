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
            materialId: 'hide1',
            chance: 50,
            amount: 6,
          },
        ],
      },
      {
        level: 2,
        drops: [
          {
            materialId: 'hide1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'hide2',
            chance: 30,
            amount: 4,
          },
        ],
      },
      {
        level: 3,
        drops: [
          {
            materialId: 'hide1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'hide2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'hide3',
            chance: 30,
            amount: 3,
          },
        ],
      },
      {
        level: 4,
        drops: [
          {
            materialId: 'hide1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'hide2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'hide3',
            chance: 70,
            amount: 3,
          },
          {
            materialId: 'hide4',
            chance: 30,
            amount: 2,
          },
        ],
      },
      {
        level: 5,
        drops: [
          {
            materialId: 'hide1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'hide2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'hide3',
            chance: 70,
            amount: 3,
          },
          {
            materialId: 'hide4',
            chance: 70,
            amount: 2,
          },
          {
            materialId: 'hide5',
            chance: 30,
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
            materialId: 'fin1',
            chance: 50,
            amount: 6,
          },
        ],
      },
      {
        level: 2,
        drops: [
          {
            materialId: 'fin1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'fin2',
            chance: 30,
            amount: 4,
          },
        ],
      },
      {
        level: 3,
        drops: [
          {
            materialId: 'fin1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'fin2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'fin3',
            chance: 30,
            amount: 3,
          },
        ],
      },
      {
        level: 4,
        drops: [
          {
            materialId: 'fin1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'fin2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'fin3',
            chance: 70,
            amount: 3,
          },
          {
            materialId: 'fin4',
            chance: 30,
            amount: 2,
          },
        ],
      },
      {
        level: 5,
        drops: [
          {
            materialId: 'fin1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'fin2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'fin3',
            chance: 70,
            amount: 3,
          },
          {
            materialId: 'fin4',
            chance: 70,
            amount: 2,
          },
          {
            materialId: 'fin5',
            chance: 30,
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
            materialId: 'scale1',
            chance: 50,
            amount: 6,
          },
        ],
      },
      {
        level: 2,
        drops: [
          {
            materialId: 'scale1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'scale2',
            chance: 30,
            amount: 4,
          },
        ],
      },
      {
        level: 3,
        drops: [
          {
            materialId: 'scale1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'scale2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'scale3',
            chance: 30,
            amount: 3,
          },
        ],
      },
      {
        level: 4,
        drops: [
          {
            materialId: 'scale1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'scale2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'scale3',
            chance: 70,
            amount: 3,
          },
          {
            materialId: 'scale4',
            chance: 30,
            amount: 2,
          },
        ],
      },
      {
        level: 5,
        drops: [
          {
            materialId: 'scale1',
            chance: 70,
            amount: 6,
          },
          {
            materialId: 'scale2',
            chance: 70,
            amount: 4,
          },
          {
            materialId: 'scale3',
            chance: 70,
            amount: 3,
          },
          {
            materialId: 'scale4',
            chance: 70,
            amount: 2,
          },
          {
            materialId: 'scale5',
            chance: 30,
            amount: 1,
          },
        ],
      },
    ],
  },
];

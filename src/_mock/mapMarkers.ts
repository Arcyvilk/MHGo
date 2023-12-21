export type MapMarker = {
  id: string;
  coords: number[];
  respawnTime: number; // in seconds?
};

export type MonsterMarker = MapMarker & {
  monsterId: string;
  level: number;
};

export type ResourceMarker = MapMarker & {
  resourceId: string;
};

export const resourceMarkers: ResourceMarker[] = [
  {
    id: '1',
    resourceId: '1',
    coords: [59.9420635, 10.7162598],
    respawnTime: 3000,
    // drops: [
    //   {
    //     dropId: 'bug1',
    //     chance: 100,
    //     amount: 1,
    //   },
    //   {
    //     dropId: 'bug2',
    //     chance: 50,
    //     amount: 1,
    //   },
    //   {
    //     dropId: 'bug3',
    //     chance: 25,
    //     amount: 1,
    //   },
    //   {
    //     dropId: 'bug4',
    //     chance: 12,
    //     amount: 1,
    //   },
    //   {
    //     dropId: 'bug5',
    //     chance: 6,
    //     amount: 1,
    //   },
    // ],
  },
];
export const monsterMarkers: MonsterMarker[] = [
  {
    id: '1',
    monsterId: 'angrybird',
    coords: [59.941134, 10.716524],
    respawnTime: 300,
    level: 1,
  },
  {
    id: '2',
    monsterId: 'babcianiath',
    coords: [59.94392, 10.715436],
    respawnTime: 300,
    level: 2,
  },
  {
    id: '3',
    monsterId: 'babcioth',
    coords: [59.945375, 10.719106],
    respawnTime: 300,
    level: 3,
  },
  {
    id: '4',
    monsterId: 'businessnath',
    coords: [59.942205, 10.718076],
    respawnTime: 300,
    level: 4,
  },
];
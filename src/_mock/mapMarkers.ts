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

// MOVED TO DATABASE
export const RESPAWN_TIME = 300; // This will be the same for everything

// MOVED TO DATABASE
export const monsterMarkers: MonsterMarker[] = [
  // praca
  {
    monsterId: 'angrybird',
    coords: [59.941134, 10.716524],
  },
  {
    monsterId: 'babcianiath',
    coords: [59.94392, 10.715436],
  },
  {
    monsterId: 'businessnath',
    coords: [59.942205, 10.718076],
  },
  // dom
  {
    monsterId: 'angrybird',
    coords: [59.8925197, 10.6198271],
  },
  {
    monsterId: 'babcianiath',
    coords: [59.893297, 10.6185925],
  },
  {
    monsterId: 'businessnath',
    coords: [59.8915828, 10.6191182],
  },
  {
    monsterId: 'sabertooth',
    coords: [59.894065, 10.6275319],
  },
].map((monster, index) => ({
  ...monster,
  id: String(index + 1),
  respawnTime: RESPAWN_TIME,
  level: 1,
}));

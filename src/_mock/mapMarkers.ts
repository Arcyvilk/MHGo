export type MapMarker = {
  id: string;
  coords: number[];
  respawnTime: number; // in seconds?
};

export type MonsterMarker = MapMarker & {
  monsterId: string;
  level: number | null;
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
    level: null,
  },
  {
    monsterId: 'babcianiath',
    coords: [59.94392, 10.715436],
    level: null,
  },
  {
    monsterId: 'businessnath',
    coords: [59.942205, 10.718076],
    level: null,
  },
  {
    monsterId: 'dracolich',
    coords: [59.9442758, 10.7185793],
    level: 5,
  },
  {
    monsterId: 'sabertooth',
    coords: [59.9409978752237, 10.714008808135988],
    level: null,
  },
  // dom
  {
    monsterId: 'angrybird',
    coords: [59.8925197, 10.6198271],
    level: null,
  },
  {
    monsterId: 'babcianiath',
    coords: [59.893297, 10.6185925],
    level: null,
  },
  {
    monsterId: 'businessnath',
    coords: [59.8915828, 10.6191182],
    level: null,
  },
  {
    monsterId: 'sabertooth',
    coords: [59.894065, 10.6275319],
    level: null,
  },
  {
    monsterId: 'dracolich',
    coords: [59.890799, 10.617814],
    level: 5,
  },
].map((monster, index) => ({
  ...monster,
  id: String(index + 1),
  respawnTime: RESPAWN_TIME,
  level: monster.level ?? null,
}));

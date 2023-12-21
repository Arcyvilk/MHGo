export type MapMarker = {
  id: string;
  coords: number[];
  respawnTime: number; // in seconds?
  drops: Drop[];
};

export type Drop = {
  dropId: string; // ID of the material to drop
  chance: number; // from 0 to 100
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
    drops: [
      {
        dropId: 'bug1',
        chance: 100,
      },
      {
        dropId: 'bug2',
        chance: 50,
      },
      {
        dropId: 'bug3',
        chance: 25,
      },
      {
        dropId: 'bug4',
        chance: 12,
      },
      {
        dropId: 'bug5',
        chance: 6,
      },
    ],
  },
];
export const monsterMarkers: MonsterMarker[] = [
  {
    id: '1',
    monsterId: 'babcianiath',
    coords: [59.941134, 10.716524],
    respawnTime: 300,
    level: 2,
    drops: [
      {
        dropId: 'claw1',
        chance: 100,
      },
    ],
  },
];

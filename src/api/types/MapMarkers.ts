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

import { WithId } from 'mongodb';

export type MapMarker = WithId<{
  id: string;
  coords: number[];
  respawnTime?: number; // in seconds?
}>;

export type HabitatMarker = MapMarker & {
  habitatId: string;
  level: number | null;
};

export type MonsterMarker = HabitatMarker & {
  monsterId: string;
};

export type ResourceMarker = MapMarker & {
  resourceId: string;
};

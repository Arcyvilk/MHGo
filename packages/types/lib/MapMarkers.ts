import { WithId } from 'mongodb';

export type MapMarker = WithId<{
  id: string;
  coords: number[];
  respawnTime?: number; // in seconds?
}>;

export type BiomeMarker = MapMarker & {
  biomeId: string;
  level: number | null;
};

export type MonsterMarker = BiomeMarker & {
  monsterId: string;
};

export type ResourceMarker = MapMarker & {
  resourceId: string;
};

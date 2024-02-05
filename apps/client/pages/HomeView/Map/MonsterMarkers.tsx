import { Fragment, useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  SoundSE,
  useMonsterMarkersApi,
  useMonstersApi,
  useNavigateWithScroll,
  useSounds,
} from '@mhgo/front';

import { useMonsterMarkerIcon } from './useMonsterMarkerIcon';
import { useUser } from '../../../hooks/useUser';

type MonsterMarkersProps = { coords?: number[] };
export const MonsterMarkers = (props: MonsterMarkersProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ coords }: MonsterMarkersProps) => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { playSound } = useSounds(undefined);

  const monsterMarkers = useMonsterMapMarkers(coords);

  return (
    <>
      {monsterMarkers.map(m => {
        const position = L.latLng(m.coords[0], m.coords[1]);
        const onClick = () => {
          playSound(SoundSE.CLICK);
          navigateWithoutScroll(
            `/prepare?markerId=${m.id}&monsterId=${m.monsterId}&level=${m.level}`,
          );
        };

        return (
          <Fragment key={m.id}>
            <SingleMonsterMarker
              monster={{
                id: m.id,
                thumbnail: m.thumbnail,
                level: m.level ?? 0,
              }}
              position={position}
              onClick={onClick}
            />
          </Fragment>
        );
      })}
    </>
  );
};

type SingleMonsterMarkerProps = {
  monster: { id: string; thumbnail?: string; level?: number };
  position: L.LatLng;
  onClick: () => void;
};
const SingleMonsterMarker = ({
  monster,
  position,
  onClick,
}: SingleMonsterMarkerProps) => {
  const { icon, isMarkerIconLoaded } = useMonsterMarkerIcon(
    monster.thumbnail,
    monster.level,
  );

  if (!isMarkerIconLoaded) return null;
  return (
    <Marker
      key={`monster-${monster.id}`}
      icon={icon}
      position={position}
      eventHandlers={{ click: onClick }}
    />
  );
};

const useMonsterMapMarkers = (coords?: number[]) => {
  const { userId } = useUser();
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers } = useMonsterMarkersApi(userId, coords);

  const monsterMarkersData = useMemo(() => {
    return monsterMarkers?.map(monsterMarker => {
      const { thumbnail, name } =
        monsters?.find(m => m.id === monsterMarker.monsterId) ?? {};
      return {
        ...monsterMarker,
        thumbnail,
        name,
      };
    });
  }, [monsterMarkers, monsters]);

  return monsterMarkersData;
};

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
import StarYellow from '@mhgo/front/assets/icons/StarYellow.svg';
import { useUser } from '../../../hooks/useUser';

import s from './Marker.module.scss';

type MonsterMarkersProps = { coords?: number[] };
export const MonsterMarkers = (props: MonsterMarkersProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ coords }: MonsterMarkersProps) => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { playSound } = useSounds(undefined);

  // We make coords less precise so we don't refetch every second
  const fixedCoords = coords
    ? [Number(coords[0].toFixed(2)), Number(coords[1].toFixed(2))]
    : undefined;

  const monsterMarkers = useMonsterMapMarkers(fixedCoords);

  return (
    <>
      {monsterMarkers.map(m => {
        const position = L.latLng(m.coords[0], m.coords[1]);
        const onClick = () => {
          playSound(SoundSE.CLICK);
          navigateWithoutScroll(`/prepare?id=${m.id}&level=${m.level}`);
        };

        return (
          <Fragment key={m.id}>
            <Marker
              key={'monster-' + m.id}
              icon={getMonsterMarkerIcon(m.level, m.thumbnail)}
              position={position}
              eventHandlers={{ click: onClick }}
            />
          </Fragment>
        );
      })}
    </>
  );
};

const getMonsterMarkerIcon = (level: number | null = 0, thumbnail?: string) => {
  const stars = new Array(level)
    .fill(null)
    .map(() => `<img src="${StarYellow}" class="${s.marker__star}" />`)
    .join('');

  return new L.DivIcon({
    className: s.marker__icon,
    html: `<div class="${s.marker__wrapper}">
        <img src="${thumbnail}" class="${s.marker__thumbnail}"/>    
        <div class="${s.marker__stars}">
          ${stars}
        </div>  
      </div>`,
  });
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

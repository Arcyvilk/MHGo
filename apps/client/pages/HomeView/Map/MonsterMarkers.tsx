import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  useMonsterMarkersApi,
  useMonstersApi,
} from '@mhgo/front';
import StarYellow from '@mhgo/front/assets/icons/StarYellow.svg';

import s from './Marker.module.scss';
import { useUser } from '../../../hooks/useUser';

export const MonsterMarkers = () => (
  <QueryBoundary fallback={null}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const monsterMarkers = useMonsterMarkers();

  return (
    <>
      {monsterMarkers.map(m => {
        const position = L.latLng(m.coords[0], m.coords[1]);
        const onClick = () => {
          navigate(`/prepare?id=${m.id}&level=${m.level}`);
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

const useMonsterMarkers = () => {
  const { userId } = useUser();
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers } = useMonsterMarkersApi(userId);

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

import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { QueryBoundary } from '@mhgo/front';
import StarYellow from '@mhgo/front/assets/icons/StarYellow.svg';

import { useMonsterMarkers } from '../../../hooks/useMonster';

import s from './MonsterMarkers.module.scss';

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
    .map(() => `<img src="${StarYellow}" class="${s.monsterMarker__star}" />`)
    .join('');

  return new L.DivIcon({
    className: s.monsterMarker__icon,
    html: `<div class="${s.monsterMarker__wrapper}">
        <img src="${thumbnail}" class="${s.monsterMarker__thumbnail}"/>
        <div class="${s.monsterMarker__stars}">
          ${stars}
        </div>
      </div>`,
  });
};

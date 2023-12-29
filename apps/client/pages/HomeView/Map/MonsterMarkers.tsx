import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

import { useMonsterMarkers } from '../../../hooks/useMonster';
import { QueryBoundary } from '../../../components';

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
        const positionStars = L.latLng(
          m.coords[0] - 0.0003,
          m.coords[1] - 0.00057,
        );

        return (
          <Fragment key={m.id}>
            <Marker
              key={'monster-' + m.id}
              icon={m.thumbnail}
              position={position}
              eventHandlers={{
                click: () => {
                  navigate(`/prepare?id=${m.id}&level=${m.level}`);
                },
              }}
            />
            <Marker
              key={'stars-' + m.id}
              position={positionStars}
              icon={
                new L.DivIcon({
                  className: s.monsterMarker__stars,
                  html: `<div style="display: flex; justify-content: center; width: 60px !important">${new Array(
                    m.level,
                  )
                    .fill(null)
                    .map(_ => '⭐')
                    .join('')}</div>`,
                })
              }
            />
            <text
              x="20%"
              y="90%"
              fill="black"
              stroke="black"
              strokeWidth={1}
              fontSize={14}
              fontWeight={800}
              filter="drop-shadow(0 0 4px #fff)"
              z="2">
              {m.level}⭐
            </text>
          </Fragment>
        );
      })}
    </>
  );
};

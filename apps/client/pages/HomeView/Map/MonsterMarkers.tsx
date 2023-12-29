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

        return (
          <Fragment key={m.id}>
            <Marker
              key={'monster-' + m.id}
              icon={
                new L.DivIcon({
                  className: s.monsterMarker__stars,
                  html: `<div style="display: flex; flex-direction: column;">
                  <img src="${
                    m.thumbnail
                  }" style="width: 48px; height: 48px; filter: drop-shadow(0 0 2px #000);"/>
                  <div style="display: flex; justify-content: center;margin-left: 20px;">
                  ${new Array(m.level)
                    .fill(null)
                    .map(_ => '⭐')
                    .join('')}
                    </div></div>`,
                })
              }
              position={position}
              eventHandlers={{
                click: () => {
                  navigate(`/prepare?id=${m.id}&level=${m.level}`);
                },
              }}
            />
          </Fragment>
        );
      })}
    </>
  );
};

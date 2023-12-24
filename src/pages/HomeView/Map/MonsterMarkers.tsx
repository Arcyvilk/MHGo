import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker, SVGOverlay } from 'react-leaflet';
import L from 'leaflet';

import { useMonsterMarkers } from '../../../hooks/useMonster';
import { QueryBoundary } from '../../../components';

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
        const northWest: L.LatLngTuple = [
          m.coords[0] - 0.0005,
          m.coords[1] - 0.0005,
        ];
        const southEast: L.LatLngTuple = [
          m.coords[0] + 0.0005,
          m.coords[1] + 0.0005,
        ];

        return (
          <Fragment key={m.id}>
            <SVGOverlay bounds={[northWest, southEast]}>
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
                LVL {m.level}
              </text>
              <Marker
                key={m.id}
                icon={m.thumbnail}
                position={position}
                eventHandlers={{
                  click: () => {
                    navigate(`/prepare?id=${m.id}&level=${m.level}`);
                  },
                }}
              />
            </SVGOverlay>
          </Fragment>
        );
      })}
    </>
  );
};

import { useNavigate } from 'react-router-dom';
import { Marker, SVGOverlay } from 'react-leaflet';
import L from 'leaflet';

import { useMonster } from '../../../hooks/useMonster';
import { useMemo } from 'react';

export const MonsterMarkers = () => {
  const navigate = useNavigate();
  const { getMonsterMarkers } = useMonster();

  const monsterMarkers = useMemo(() => getMonsterMarkers(), []);

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
          <>
            <SVGOverlay bounds={[northWest, southEast]}>
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
              <text
                x="20%"
                y="90%"
                fill="black"
                stroke="black"
                strokeWidth={1}
                fontSize={14}
                fontWeight={800}
                filter="drop-shadow(0 0 4px #fff)">
                LVL {m.level}
              </text>
            </SVGOverlay>
          </>
        );
      })}
    </>
  );
};

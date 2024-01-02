import { Fragment, useState } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  useAdminAllMonsterMarkers,
  useMonstersApi,
} from '@mhgo/front';

import s from './Markers.module.scss';
import { CDN_URL } from '@mhgo/front/env';

export const MonsterMarkers = () => (
  <QueryBoundary fallback={null}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers } = useAdminAllMonsterMarkers();
  const [activeMarker, setActiveMarker] = useState('');

  console.log(monsterMarkers);

  return (
    <>
      {monsterMarkers.map(marker => {
        const monster = monsters.find(m => m.id === marker.monsterId) ?? {
          thumbnail: `${CDN_URL}/misc/question.svg`,
        };
        console.log(monster);
        const position = L.latLng(marker.coords[0], marker.coords[1]);
        console.log(position);

        const icon = new L.Icon({
          iconUrl: monster.thumbnail,
          iconRetinaUrl: monster.thumbnail,
          iconSize: new L.Point(32, 32),
          className: s.monsterMarker,
        });
        const onClick = () => {
          setActiveMarker(marker.id);
        };

        return (
          <Fragment key={marker.id}>
            <Marker
              key={'marker-' + marker.id}
              icon={icon}
              position={position}
              eventHandlers={{ click: onClick }}
            />
          </Fragment>
        );
      })}
    </>
  );
};

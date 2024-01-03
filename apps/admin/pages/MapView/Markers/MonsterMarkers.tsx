import { Fragment } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  useAdminAllMonsterMarkersApi,
  useMonstersApi,
} from '@mhgo/front';

import s from './Markers.module.scss';
import { CDN_URL } from '@mhgo/front/env';

type MonsterMarkerProps = {
  selectedMarker: string | null;
  setSelectedMarker: (selectedMarker: string) => void;
};
export const MonsterMarkers = (props: MonsterMarkerProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ selectedMarker, setSelectedMarker }: MonsterMarkerProps) => {
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers } = useAdminAllMonsterMarkersApi();

  return (
    <>
      {monsterMarkers.map(marker => {
        const monster = monsters.find(m => m.id === marker.monsterId) ?? {
          thumbnail: `${CDN_URL}/misc/question.svg`,
        };
        const position = L.latLng(marker.coords[0], marker.coords[1]);
        const icon = new L.Icon({
          iconUrl: monster.thumbnail,
          iconRetinaUrl: monster.thumbnail,
          iconSize: new L.Point(32, 32),
          className: s.monsterMarker,
        });

        const onClick = () => {
          // @ts-expect-error it DOES have _id
          setSelectedMarker(String(marker._id));
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

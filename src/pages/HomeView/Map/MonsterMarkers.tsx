import { useNavigate } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

import { monsters } from '../../../_mock/monsters';
import { monsterMarkers } from '../../../_mock/mapMarkers';

import s from './MonsterMarkers.module.scss';

export const MonsterMarkers = () => {
  const navigate = useNavigate();
  const monsterMarkers = useMonsterMarkers();

  return (
    <>
      {monsterMarkers.map(m => (
        <Marker
          icon={m.thumbnail}
          position={L.latLng(m.coords[0], m.coords[1])}
          eventHandlers={{
            click: e => {
              navigate(`/fight?id=${m.id}`);
            },
          }}
        />
      ))}
    </>
  );
};

const useMonsterMarkers = () => {
  const monsterMarkersData = monsterMarkers.map(monsterMarker => {
    const { thumbnail, name } =
      monsters.find(m => m.id === monsterMarker.monsterId) ?? {};
    const iconMarker = new L.Icon({
      iconUrl: thumbnail,
      iconRetinaUrl: thumbnail,
      iconSize: new L.Point(48, 48),
      className: s.monsterMarker,
    });
    return {
      ...monsterMarker,
      thumbnail: iconMarker,
      name,
    };
  });

  return monsterMarkersData;
};

import { Circle, Marker } from 'react-leaflet';
import L from 'leaflet';

import IconMarker from '@mhgo/front/assets/icons/Marker.svg';
import { useSettingsApi } from '@mhgo/front';

import s from './Marker.module.scss';

export const UserMarker = ({ coords }: { coords: number[] }) => {
  const { setting: mapRadius } = useSettingsApi('map_radius', 0);
  const position = L.latLng(coords[0], coords[1]);
  const icon = new L.DivIcon({
    className: s.marker__icon,
    html: `<div class="${s.userMarker}" key="user-marker">
        <img src="${IconMarker}" class="${s.userMarker__thumbnail}"/>
      </div>`,
  });

  return (
    <>
      <Marker icon={icon} position={position} />
      <Circle
        center={position}
        radius={mapRadius}
        color="#fdc000"
        className={s.userMarker__radius}
      />
    </>
  );
};

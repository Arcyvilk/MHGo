import L from 'leaflet';

import Marker from '@mhgo/components/assets/icons/Marker.svg';

const iconMarker = new L.Icon({
  iconUrl: Marker,
  iconRetinaUrl: Marker,
  iconSize: new L.Point(32, 28),
  className: 'marker',
});

export { iconMarker };

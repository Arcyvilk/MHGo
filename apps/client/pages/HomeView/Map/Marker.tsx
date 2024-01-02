import L from 'leaflet';

import Marker from '@mhgo/front/assets/icons/Marker.svg';

const iconMarker = new L.Icon({
  iconUrl: Marker,
  iconRetinaUrl: Marker,
  iconSize: new L.Point(24, 20),
  className: 'marker',
});

export { iconMarker };

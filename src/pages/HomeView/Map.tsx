import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import s from './Map.module.scss';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_COORDS } from '../../utils/consts';

const options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

export const Map = () => {
  const [coords, setCoords] = useState(DEFAULT_COORDS);

  const geo = useMemo(() => navigator.geolocation, []);

  useEffect(() => {
    const id = geo.watchPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);
      },
      error => {
        console.error(`ERROR(${error.code}): ${error.message}`);
      },
      options,
    );
  }, []);

  return (
    <MapContainer
      center={L.latLng(coords[0], coords[1])}
      zoom={13}
      scrollWheelZoom
      className={s.mapContainer}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
      />
      <Marker position={L.latLng(coords[0], coords[1])}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import s from './Map.module.scss';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_COORDS } from '../../utils/consts';

const geoOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

const mapOptions = {
  zoom: 16,
  minZoom: 16,
  maxZoom: 19,
  scrollWheelZoom: true,
};

export const Map = () => {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const geo = useMemo(() => navigator.geolocation, []);

  useEffect(() => {
    geo.watchPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);
      },
      error => {
        console.error(`ERROR(${error.code}): ${error.message}`);
      },
      geoOptions,
    );
  }, []);

  return (
    <MapContainer
      center={L.latLng(coords[0], coords[1])}
      className={s.mapContainer}
      {...mapOptions}>
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>
        &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>
        &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
        &copy; <a href="https://www.openstreetmap.org/copyright/" target="_blank">OpenStreetMap contributors</a>'
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

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L, { Zoom } from 'leaflet';
import { useLocalStorage, useSettingsApi } from '@mhgo/front';
import { Loader, QueryBoundary } from '@mhgo/front';

import { iconMarker } from './Marker';
import { MonsterMarkers } from './MonsterMarkers';
import { DEFAULT_COORDS } from '../../../utils/consts';

import 'leaflet/dist/leaflet.css';
import s from './Map.module.scss';

const geoOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

const mapOptions = {
  zoom: 16,
  minZoom: 15,
  maxZoom: 18,
  scrollWheelZoom: 'center' as Zoom,
  dragging: false,
};

export const Map = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const geo = useMemo(() => navigator.geolocation, []);

  const [coords, setCoords] = useLocalStorage(
    'MHGO_LAST_KNOWN_LOCATION',
    DEFAULT_COORDS,
  );

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
      <MapLayer coords={coords} />
    </MapContainer>
  );
};

type MapLayerProps = { coords: number[] };
const MapLayer = ({ coords }: MapLayerProps) => {
  const { setting: mapRadius } = useSettingsApi('map_radius', 0);
  const map = useMap();

  useEffect(() => {
    if (map) map.flyTo(L.latLng(coords[0], coords[1]));
  }, [coords, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>
          &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>
          &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
          &copy; <a href="https://www.openstreetmap.org/copyright/" target="_blank">OpenStreetMap contributors</a>'
        url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
      />
      <MonsterMarkers />
      <Circle
        center={L.latLng(coords[0], coords[1])}
        radius={mapRadius}
        color="#fdc000"
      />
      <Marker icon={iconMarker} position={L.latLng(coords[0], coords[1])} />
    </>
  );
};

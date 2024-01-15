import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { Zoom } from 'leaflet';
import { useLocalStorage } from '@mhgo/front';
import { Loader, QueryBoundary } from '@mhgo/front';

import { UserMarker } from './Marker';
import { MonsterMarkers } from './MonsterMarkers';
import { ResourceMarkers } from './ResourceMarkers';
import { TutorialMarkers } from './TutorialMarkers';
import { DEFAULT_COORDS, DEFAULT_ZOOM } from '../../../utils/consts';
import { useTutorialProgress } from '../../../hooks/useTutorial';

import 'leaflet/dist/leaflet.css';
import s from './Map.module.scss';

const geoOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

const mapOptions = {
  zoom: 17,
  minZoom: 16,
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

  const [zoom] = useLocalStorage('MHGO_MAP_ZOOM', DEFAULT_ZOOM);
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
      {...mapOptions}
      zoom={zoom.current}>
      <MapLayer coords={coords} />
    </MapContainer>
  );
};

type MapLayerProps = { coords: number[] };
const MapLayer = ({ coords }: MapLayerProps) => {
  const { isFinishedTutorialPartOne } = useTutorialProgress();
  const [_, setZoom] = useLocalStorage('MHGO_MAP_ZOOM', DEFAULT_ZOOM);
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  map.on('zoom', () => {
    setZoom({ current: map.getZoom() });
  });

  useEffect(() => {
    if (map)
      map.flyTo(L.latLng(coords[0], coords[1]), DEFAULT_ZOOM.current, {
        duration: 0.5,
      });
  }, [coords, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>
          &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>
          &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
          &copy; <a href="https://www.openstreetmap.org/copyright/" target="_blank">OpenStreetMap contributors</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
      />
      {isFinishedTutorialPartOne ? (
        <>
          <MonsterMarkers coords={coords} />
          <ResourceMarkers coords={coords} />
        </>
      ) : (
        <TutorialMarkers coords={coords} />
      )}
      <UserMarker coords={coords} />
    </>
  );
};

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { Zoom } from 'leaflet';
import { LSKeys, useLocalStorage } from '@mhgo/front';
import { Loader, QueryBoundary } from '@mhgo/front';

import { UserMarker } from './Marker';
import { MonsterMarkers } from './MonsterMarkers';
import { ResourceMarkers } from './ResourceMarkers';
import { DummyMarkers } from './DummyMarkers';
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
  preferCanvas: true,
  zoom: 17,
  minZoom: 16,
  maxZoom: 18,
  dragging: false,
  tap: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  inertia: false,
};

export const Map = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const geo = useMemo(() => navigator.geolocation, []);

  const [zoom] = useLocalStorage(LSKeys.MHGO_MAP_ZOOM, DEFAULT_ZOOM);
  const [coords, setCoords] = useLocalStorage(
    LSKeys.MHGO_LAST_KNOWN_LOCATION,
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
  const [zoom, setZoom] = useLocalStorage(LSKeys.MHGO_MAP_ZOOM, DEFAULT_ZOOM);
  const [homePosition] = useLocalStorage(LSKeys.MHGO_HOME_POSITION, {
    home: null,
  });
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  map.on('zoom', () => {
    const newZoom = Math.round(map.getZoom());
    if (newZoom !== zoom.current) setZoom({ current: newZoom });
  });

  useEffect(() => {
    if (!map) return;
    const centerCurrent = map.getCenter();
    const centerCoords = L.latLng(coords[0], coords[1]);
    const didCoordsChange =
      centerCurrent.lat.toFixed(4) !== centerCoords.lat.toFixed(4) ||
      centerCurrent.lng.toFixed(4) !== centerCoords.lng.toFixed(4);

    if (!didCoordsChange) return;

    const distanceToNewPosition = centerCurrent.distanceTo(centerCoords);

    if (distanceToNewPosition > 1000) map.panTo(centerCoords);
    else
      map.flyTo(centerCoords, zoom.current, {
        duration: 0.5,
      });
  }, [coords, map, zoom]);

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
      {homePosition?.home && <DummyMarkers coords={homePosition.home} />}
      <UserMarker coords={coords} />
    </>
  );
};

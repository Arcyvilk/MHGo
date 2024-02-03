import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { LatLng, LocationEvent } from 'leaflet';
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
import { MapActions } from '.';

const mapOptions = {
  preferCanvas: true,
  zoom: 17,
  minZoom: 16,
  maxZoom: 18,
  dragging: false,
  bounceAtZoomLimits: false, // Don't allow zooming more than bounds
  inertia: false,
  tap: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  trackResize: false,
  touchZoom: false,
  // ...(L.Browser.mobile ? { zoomSnap: undefined } : {}),
  // ...(L.Browser.mobile ? { zoomDelta: undefined } : {}),
};

export const Map = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [zoom] = useLocalStorage(LSKeys.MHGO_MAP_ZOOM, DEFAULT_ZOOM);
  const [accuracy, setAccuracy] = useState(0);
  const [coords, setCoords] = useLocalStorage(
    LSKeys.MHGO_LAST_KNOWN_LOCATION,
    DEFAULT_COORDS,
  );

  return (
    <MapContainer
      center={L.latLng(coords[0], coords[1])}
      className={s.mapContainer}
      {...mapOptions}
      zoom={zoom.current}>
      <MapLayer
        coords={coords}
        setCoords={setCoords}
        setAccuracy={setAccuracy}
      />
      <MapActions accuracy={accuracy} />
    </MapContainer>
  );
};

type MapLayerProps = {
  coords: number[];
  setCoords: (coords: number[]) => void;
  setAccuracy: (accuracy: number) => void;
};
const MapLayer = ({ coords, setCoords, setAccuracy }: MapLayerProps) => {
  const { isFinishedTutorialPartOne } = useTutorialProgress();
  const [homePosition] = useLocalStorage(LSKeys.MHGO_HOME_POSITION, {
    home: null,
  });

  useMapEvents(coords, setCoords, setAccuracy);

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

const useMapEvents = (
  coords: number[],
  setCoords: (coords: number[]) => void,
  setAccuracy: (accuracy: number) => void,
) => {
  const map = useMap();
  const [zoom, setZoom] = useLocalStorage(LSKeys.MHGO_MAP_ZOOM, DEFAULT_ZOOM);

  // Handle map zoom
  const onMapZoom = () => {
    const newZoom = Math.round(map.getZoom());
    if (newZoom !== zoom.current) setZoom({ current: newZoom });
  };

  map.on('zoom', onMapZoom);

  // Handle map change location
  const onLocationFound = (location: LocationEvent) => {
    const { accuracy, latlng } = location;
    setCoords([latlng.lat, latlng.lng]);
    setAccuracy(accuracy);
  };
  map.on('locationfound', onLocationFound);

  // const onLocationError = (e: any) => {
  //   console.log(e.message);
  // };
  // map.on('locationerror', onLocationError);

  // Refresh location every second
  map.locate({
    setView: true,
    watch: true,
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
    maxZoom: zoom.current,
  });

  // Get rid of the blank tiles on render
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const newCoords = L.latLng(coords[0], coords[1]);
    map.panTo(newCoords);
  }, [coords, map, zoom]);
};

// TODO Those were used to update marker's position only when position changed
// by more than 10^-4 accuracy. But it triggered a very ugly bug with local storage
// so it's disabled. Leaving it here in case it was important enough to be reenabled

// const getIsSignificantCoordsChange = (newCoords: LatLng) => {
//   const centerCurrent = map.getCenter();

//   const isSignificantCoordsChange =
//     roundToDecimal(centerCurrent.lat, 4) !== roundToDecimal(newCoords.lat, 4) ||
//     roundToDecimal(centerCurrent.lng, 4) !== roundToDecimal(newCoords.lng, 4);

//   return isSignificantCoordsChange;
// };

// const roundToDecimal = (num: number, decimal: number) => {
//   const toDecimal = Math.pow(10, decimal);
//   return Math.round((num + Number.EPSILON) * toDecimal) / toDecimal;
// };

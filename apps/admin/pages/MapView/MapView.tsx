import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button, Loader, QueryBoundary, useLocalStorage } from '@mhgo/front';

import { MonsterMarkers } from './Markers';

import s from './MapView.module.scss';
import { ActionBar } from '../../containers';

export const DEFAULT_COORDS = [59.892131, 10.6194067];

export const MapView = () => (
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
  const [selectedCoords, setSelectedCoords] = useState<number[]>(coords);

  const onCenterMap = () => {
    geo.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);
      },
      error => {
        console.error(`ERROR(${error.code}): ${error.message}`);
      },
    );
  };

  return (
    <div className={s.mapView}>
      <div className={s.mapView__header}>
        <h1 className={s.mapView__title}>MAP</h1>
      </div>
      <div className={s.mapView__content}>
        <ActionBar
          buttons={<Button label="Center on me" onClick={onCenterMap} />}
        />
        <MapContainer
          center={L.latLng(coords[0], coords[1])}
          className={s.mapContainer}
          zoom={16}
          style={{ height: '400px' }}>
          <MapLayer
            currentCoords={coords}
            setSelectedCoords={setSelectedCoords}
          />
        </MapContainer>
      </div>
    </div>
  );
};

type MapLayerProps = {
  currentCoords: number[];
  setSelectedCoords: (selectedCoords: number[]) => void;
};
const MapLayer = ({ currentCoords, setSelectedCoords }: MapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (map) map.flyTo(L.latLng(currentCoords[0], currentCoords[1]));
  }, [currentCoords, map]);

  map.on('click', ev => {
    const latlng = map.mouseEventToLatLng(ev.originalEvent);
    setSelectedCoords([latlng.lat, latlng.lng]);
  });

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MonsterMarkers />
    </>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import { Button, Loader, QueryBoundary, useLocalStorage } from '@mhgo/front';
import { ActionBar, HeaderEdit } from '../../containers';
import { MapLayer } from './MapLayer';
import { MonsterMarkerCreateView, MonsterMarkerEditView } from './SingleMarker';

import s from './MapView.module.scss';

export const DEFAULT_COORDS = [59.892131, 10.6194067];

export const MapView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const geo = useMemo(() => navigator.geolocation, []);
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });

  const [coords, setCoords] = useLocalStorage(
    'MHGO_LAST_KNOWN_LOCATION',
    DEFAULT_COORDS,
  );

  const [createView, setCreateView] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<number[]>(coords);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

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

  useEffect(() => {
    if (!selectedMarker) setCreateView(false);
  }, [selectedMarker]);

  return (
    <div className={s.mapView}>
      <HeaderEdit status={status} title="MAP" />
      <ActionBar
        buttons={<Button label="Center on me" onClick={onCenterMap} />}
      />
      <div className={s.mapView__content}>
        <MapContainer
          center={L.latLng(coords[0], coords[1])}
          className={s.mapContainer}
          zoom={16}
          style={{ height: '400px' }}>
          <MapLayer
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            currentCoords={coords}
            setSelectedCoords={setSelectedCoords}
            setCreateView={setCreateView}
          />
        </MapContainer>
      </div>
      {selectedMarker && (
        <MonsterMarkerEditView
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          selectedCoords={selectedCoords}
          onCancel={() => setSelectedMarker(null)}
          setStatus={setStatus}
        />
      )}
      {!selectedMarker && createView && (
        <MonsterMarkerCreateView
          selectedCoords={selectedCoords}
          onCancel={() => setCreateView(false)}
          setStatus={setStatus}
        />
      )}
    </div>
  );
};

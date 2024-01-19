import { useEffect, useMemo, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import { FormControlLabel, Switch } from '@mui/material';
import {
  Button,
  LSKeys,
  Loader,
  QueryBoundary,
  useLocalStorage,
} from '@mhgo/front';

import { ActionBar, HeaderEdit } from '../../containers';
import { DEFAULT_COORDS } from '../../utils/defaults';
import { MapLayer } from './MapLayer';
import { MarkerCreateView, MarkerEditView } from './SingleMarker';

import s from './MapView.module.scss';

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
    LSKeys.MHGO_LAST_KNOWN_LOCATION,
    DEFAULT_COORDS,
  );

  const [createView, setCreateView] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<number[]>(coords);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const [showResources, setShowResources] = useState(true);
  const [showMonsters, setShowMonsters] = useState(true);

  const onCenterMapOnMe = () => {
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
        title={
          selectedMarker ? (
            <span style={{ fontWeight: 600 }}>Marker ID: {selectedMarker}</span>
          ) : (
            ''
          )
        }
        buttons={
          <div style={{ display: 'flex', gap: '8px' }}>
            <FormControlLabel
              label="Resources"
              control={
                <Switch
                  defaultChecked={true}
                  value={showResources}
                  color="default"
                  onChange={(_, checked) => setShowResources(checked)}
                />
              }
            />
            <FormControlLabel
              label="Monsters"
              control={
                <Switch
                  defaultChecked={true}
                  value={showMonsters}
                  color="default"
                  onChange={(_, checked) => setShowMonsters(checked)}
                />
              }
            />
            <Button label="Center on me" onClick={onCenterMapOnMe} />
          </div>
        }
      />
      <div className={s.mapView__content}>
        <MapContainer
          center={L.latLng(coords[0], coords[1])}
          className={s.mapContainer}
          zoom={16}>
          <MapLayer
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            currentCoords={coords}
            setSelectedCoords={setSelectedCoords}
            setCreateView={setCreateView}
            showMonsters={showMonsters}
            showResources={showResources}
          />
        </MapContainer>
      </div>
      {selectedMarker && (
        <MarkerEditView
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          selectedCoords={selectedCoords}
          setSelectedCoords={setSelectedCoords}
          onCancel={() => setSelectedMarker(null)}
          setStatus={setStatus}
        />
      )}
      {!selectedMarker && createView && (
        <MarkerCreateView
          selectedCoords={selectedCoords}
          onCancel={() => setCreateView(false)}
          setStatus={setStatus}
        />
      )}
    </div>
  );
};

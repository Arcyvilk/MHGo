import { useEffect, useMemo, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import L, { Zoom } from 'leaflet';
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
import { toast } from 'react-toastify';

const mapOptions = {
  zoom: 16,
  minZoom: 1,
  maxZoom: 20,
  scrollWheelZoom: 'center' as Zoom,
  dragging: true,
};

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

  const [isSatelliteEnabled, setIsSatelliteEnabled] = useState(false);
  const [showResources, setShowResources] = useState(true);
  const [showMonsters, setShowMonsters] = useState(true);

  const onCenterMapOnMe = () => {
    toast.info('Centering on your current position...');
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
      <HeaderEdit status={status} title="MAP" hasBackButton={false} />

      <ActionBar
        title={
          selectedMarker ? (
            <span style={{ fontWeight: 600 }}>Marker ID: {selectedMarker}</span>
          ) : (
            ''
          )
        }
        buttons={
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}>
            <FormControlLabel
              label="Satellite view"
              control={
                <Switch
                  defaultChecked={false}
                  value={isSatelliteEnabled}
                  color="default"
                  onChange={(_, checked) => setIsSatelliteEnabled(checked)}
                />
              }
            />
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
      <MapContainer
        center={L.latLng(coords[0], coords[1])}
        className={s.mapContainer}
        {...mapOptions}
        style={{ height: '600px' }}
        zoom={16}>
        <MapLayer
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          currentCoords={coords}
          setSelectedCoords={setSelectedCoords}
          setCreateView={setCreateView}
          showMonsters={showMonsters}
          showResources={showResources}
          isSatelliteEnabled={isSatelliteEnabled}
        />
      </MapContainer>
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

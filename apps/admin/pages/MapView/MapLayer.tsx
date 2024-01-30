import { useEffect, useMemo } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import { MonsterMarkers, ResourceMarkers } from './Markers';
import { MAP_KEY } from '../../env';

type MapLayerProps = {
  currentCoords: number[];
  setSelectedCoords: (selectedCoords: number[]) => void;
  selectedMarker: string | null;
  setSelectedMarker: (selectedMarker: string | null) => void;
  setCreateView: (createView: boolean) => void;
  showMonsters: boolean;
  showResources: boolean;
  isSatelliteEnabled: boolean;
};
export const MapLayer = ({
  currentCoords,
  setSelectedCoords,
  selectedMarker,
  setSelectedMarker,
  setCreateView,
  showMonsters,
  showResources,
  isSatelliteEnabled,
}: MapLayerProps) => {
  const map = useMap();

  const { attribution, url } = useMemo(() => {
    if (isSatelliteEnabled)
      return {
        attribution:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        url: `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${MAP_KEY}`,
      };
    else
      return {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      };
  }, [isSatelliteEnabled]);

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (map) map.flyTo(L.latLng(currentCoords[0], currentCoords[1]));
  }, [currentCoords, map]);

  map.on('click', ev => {
    const latlng = map.mouseEventToLatLng(ev.originalEvent);
    setSelectedCoords([latlng.lat, latlng.lng]);
    setCreateView(true);
  });

  return (
    <>
      <TileLayer attribution={attribution} url={url} />
      {showMonsters && (
        <MonsterMarkers
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          setSelectedCoords={setSelectedCoords}
        />
      )}
      {showResources && (
        <ResourceMarkers
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          setSelectedCoords={setSelectedCoords}
        />
      )}
    </>
  );
};

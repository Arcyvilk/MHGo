import { useEffect, useMemo } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MonsterMarkers, ResourceMarkers } from './Markers';

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
          '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>&copy; <a href="https://www.openstreetmap.org/copyright/" target="_blank">OpenStreetMap contributors</a>',
        url: 'https://tiles.stadiamaps.com/data/satellite/{z}/{x}/{y}.jpg',
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

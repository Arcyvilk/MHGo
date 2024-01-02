import { useEffect } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MonsterMarkers } from './Markers';

type MapLayerProps = {
  currentCoords: number[];
  setSelectedCoords: (selectedCoords: number[]) => void;
  selectedMarker: string | null;
  setSelectedMarker: (selectedMarker: string) => void;
  setCreateView: (createView: boolean) => void;
};
export const MapLayer = ({
  currentCoords,
  setSelectedCoords,
  selectedMarker,
  setSelectedMarker,
  setCreateView,
}: MapLayerProps) => {
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
    setCreateView(true);
  });

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MonsterMarkers
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
      />
    </>
  );
};

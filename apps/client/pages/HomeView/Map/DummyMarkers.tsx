import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  SoundSE,
  useMonstersApi,
  useNavigateWithScroll,
  useSounds,
} from '@mhgo/front';

import s from './Marker.module.scss';

type DummyMarkersProps = { coords?: number[] };
export const DummyMarkers = (props: DummyMarkersProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ coords }: DummyMarkersProps) => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { playSound } = useSounds(undefined);
  const { data: monsters } = useMonstersApi();
  const trainingMonster = monsters.find(m => m.id === 'dummy');

  if (!coords || !trainingMonster) return null;

  const position = L.latLng(coords[0], coords[1]);
  const onClick = () => {
    playSound(SoundSE.CLICK);
    navigateWithoutScroll(`/prepare?id=dummy&level=1`);
  };

  return (
    <Marker
      key={'marker-dummy'}
      icon={getResourceMarkerIcon(trainingMonster.thumbnail)}
      position={position}
      eventHandlers={{ click: onClick }}
    />
  );
};

const getResourceMarkerIcon = (thumbnail?: string) => {
  return new L.DivIcon({
    className: s.marker__icon,
    html: `<div class="${s.marker__wrapper}">
        <img src="${thumbnail}" class="${s.marker__thumbnail}"/>
      </div>`,
  });
};

import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  SoundSE,
  useMonstersApi,
  useNavigateWithScroll,
  useSounds,
} from '@mhgo/front';

import { useMonsterMarkerIcon } from './useMonsterMarkerIcon';

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

  const { icon } = useMonsterMarkerIcon(trainingMonster?.thumbnail);

  if (!coords || !trainingMonster) return null;

  const position = L.latLng(coords[0], coords[1]);
  const onClick = () => {
    playSound(SoundSE.CLICK);
    navigateWithoutScroll(`/prepare?markerId=dummy&monsterId=dummy&level=1`);
  };

  return (
    <Marker
      key={'marker-dummy'}
      icon={icon}
      position={position}
      eventHandlers={{ click: onClick }}
    />
  );
};

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

type TutorialMarkersProps = { coords?: number[] };
export const TutorialMarkers = (props: TutorialMarkersProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ coords }: TutorialMarkersProps) => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { playSound } = useSounds(undefined);
  const { data: monsters } = useMonstersApi();
  const tutorialMonster = monsters.find(m => m.id === 'tutorial');

  const { icon } = useMonsterMarkerIcon(tutorialMonster?.thumbnail);

  if (!coords || !tutorialMonster) return null;

  const position = L.latLng(coords[0], coords[1]);
  const onClick = () => {
    playSound(SoundSE.CLICK);
    navigateWithoutScroll(
      `/prepare?markerId=tutorial&monsterId=tutorial&level=1`,
    );
  };

  return (
    <Marker
      key={'marker-tutorial'}
      icon={icon}
      position={position}
      eventHandlers={{ click: onClick }}
    />
  );
};

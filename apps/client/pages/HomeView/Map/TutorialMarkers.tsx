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

  if (!coords || !tutorialMonster) return null;

  const position = L.latLng(coords[0], coords[1]);
  const onClick = () => {
    playSound(SoundSE.CLICK);
    navigateWithoutScroll(`/prepare?id=tutorial&level=1`);
  };

  return (
    <Marker
      key={'marker-tutorial'}
      icon={getResourceMarkerIcon(tutorialMonster.thumbnail)}
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

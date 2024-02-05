import { Fragment, useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  SoundSE,
  modifiers,
  useNavigateWithScroll,
  useResourceMarkersApi,
  useResourcesApi,
  useSounds,
} from '@mhgo/front';
import { useUser } from '../../../hooks/useUser';

import s from './Marker.module.scss';

type ResourceMarkerProps = { coords?: number[] };
export const ResourceMarkers = (props: ResourceMarkerProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ coords }: ResourceMarkerProps) => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { playSound } = useSounds(undefined);

  const resourceMarkers = useResourceMarkers(coords);

  return (
    <>
      {resourceMarkers.map(r => {
        const position = L.latLng(r.coords[0], r.coords[1]);
        const onClick = () => {
          playSound(SoundSE.CLICK);
          navigateWithoutScroll(`/forage?markerId=${r.id}`);
        };

        return (
          <Fragment key={r.id}>
            <Marker
              key={'resource-' + r.id}
              icon={getResourceMarkerIcon(r.thumbnail)}
              position={position}
              eventHandlers={{ click: onClick }}
            />
          </Fragment>
        );
      })}
    </>
  );
};

const getResourceMarkerIcon = (thumbnail?: string) => {
  return new L.DivIcon({
    className: s.marker__icon,
    html: `<div class="${s.marker__wrapper}">
        <img src="${thumbnail}" class="${modifiers(
          s,
          'marker__thumbnail',
          'small',
        )}"/>
      </div>`,
  });
};

const useResourceMarkers = (coords?: number[]) => {
  const { userId } = useUser();
  const { data: resources } = useResourcesApi();
  const { data: resourceMarkers } = useResourceMarkersApi(userId, coords);

  const resourcesMarkersData = useMemo(() => {
    return resourceMarkers?.map(resourceMarker => {
      const { thumbnail, name } =
        resources?.find(r => r.id === resourceMarker.resourceId) ?? {};
      return {
        ...resourceMarker,
        thumbnail,
        name,
      };
    });
  }, [resourceMarkers, resources]);

  return resourcesMarkersData;
};

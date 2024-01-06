import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  useResourceMarkersApi,
  useResourcesApi,
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
  const navigate = useNavigate();

  // We make coords less precise so we don't refetch every second
  const fixedCoords = coords
    ? [Number(coords[0].toFixed(2)), Number(coords[1].toFixed(2))]
    : undefined;

  const resourceMarkers = useResourceMarkers(fixedCoords);

  return (
    <>
      {resourceMarkers.map(r => {
        const position = L.latLng(r.coords[0], r.coords[1]);
        const onClick = () => {
          // @ts-expect-error _id in fact exists
          navigate(`/forage?id=${String(r._id)}`);
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
        <img src="${thumbnail}" class="${s.marker__thumbnail}"/>
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

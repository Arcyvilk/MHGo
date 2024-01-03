import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  QueryBoundary,
  useAllResourceMarkersApi,
  useResourcesApi,
} from '@mhgo/front';

import s from './Marker.module.scss';

export const ResourceMarkers = () => (
  <QueryBoundary fallback={null}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const resourceMarkers = useResourceMarkers();

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

const useResourceMarkers = () => {
  const { data: resourceMarkers } = useAllResourceMarkersApi();
  const { data: resources } = useResourcesApi();

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

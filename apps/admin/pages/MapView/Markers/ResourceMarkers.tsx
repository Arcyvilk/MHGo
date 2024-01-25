import { Fragment } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

import { CDN_URL } from '@mhgo/front/env';
import {
  QueryBoundary,
  modifiers,
  useAdminAllResourceMarkersApi,
  useResourcesApi,
} from '@mhgo/front';

import s from './Markers.module.scss';

type ResourceMarkerProps = {
  selectedMarker: string | null;
  setSelectedMarker: (selectedMarker: string) => void;
  setSelectedCoords: (selectedCoords: number[]) => void;
};
export const ResourceMarkers = (props: ResourceMarkerProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({
  selectedMarker,
  setSelectedMarker,
  setSelectedCoords,
}: ResourceMarkerProps) => {
  const { data: resources } = useResourcesApi(true);
  const { data: resourceMarkers } = useAdminAllResourceMarkersApi();

  return (
    <>
      {resourceMarkers.map(marker => {
        const monster = resources.find(r => r.id === marker.resourceId) ?? {
          thumbnail: `${CDN_URL}/misc/question.svg`,
        };
        const position = L.latLng(marker.coords[0], marker.coords[1]);
        const icon = new L.DivIcon({
          className: s.marker__icon,
          html: `<div class="${s.marker__wrapper}" key="markericon-${String(
            // @ts-expect-error But _id in fact DOES exist
            marker._id,
          )}">
              <img src="${monster.thumbnail}" class="${modifiers(
                s,
                'marker__thumbnail',
                // @ts-expect-error it DOES have _id
                { isSelected: String(marker._id) === selectedMarker },
              )}"/>
            </div>`,
        });

        const onClick = () => {
          // @ts-expect-error it DOES have _id
          setSelectedMarker(String(marker._id));
        };

        return (
          // @ts-expect-error But _id in fact DOES exist
          <Fragment key={String(marker._id)}>
            <Marker
              // @ts-expect-error But _id in fact DOES exist
              key={'marker-' + String(marker._id)}
              icon={icon}
              position={position}
              eventHandlers={{ click: onClick }}
            />
          </Fragment>
        );
      })}
    </>
  );
};

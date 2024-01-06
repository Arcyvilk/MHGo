import { useEffect, useState } from 'react';
import L from 'leaflet';
import {
  CloseButton,
  Loader,
  QueryBoundary,
  Rays,
  Nuke,
  modifiers,
  useAllResourceMarkersApi,
  useResourcesApi,
  useSettingsApi,
  InfoBar,
} from '@mhgo/front';
import { SoundSE, useLocalStorage, useSounds } from '@mhgo/front/hooks';

import { ModalForage } from './ModalForage';
import s from './ForageView.module.scss';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COORDS, DEFAULT_MAP_RADIUS } from '../../utils/consts';

export const ForageView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingHits, setRemainingHits] = useState(10);
  const { resource, inRange } = useResource();
  const { playSESound } = useSounds();

  const isActive = remainingHits > 0;
  const isOnCooldown = remainingHits <= 0;

  const onForage = () => {
    if (remainingHits > 0) {
      playSESound(SoundSE.CRYSTAL);
      setRemainingHits(remainingHits - 1);
    }
  };

  const onFinish = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (!isActive)
      setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
  }, [isActive]);

  if (!resource) return null;
  return (
    <div className={s.forageView}>
      {!isActive && isModalOpen && (
        <ModalForage isOpen setIsOpen={setIsModalOpen} onClose={onFinish} />
      )}
      <Header name={resource.name} />
      <div className={s.forageView__resourceWrapper}>
        {inRange ? (
          <>
            {isActive && <Rays />}
            {isOnCooldown && <Nuke />}
            <img
              className={modifiers(s, 'forageView__resource', {
                isActive,
                isOnCooldown,
              })}
              onClick={onForage}
              src={resource.img}
              draggable={false}
            />
          </>
        ) : (
          <>
            <img
              className={s.forageView__resource}
              src={resource.img}
              draggable={false}
            />
            <InfoBar text="You are not in range!" />
          </>
        )}
      </div>
      <CloseButton />
    </div>
  );
};

type HeaderProps = { name?: string };
const Header = ({ name = '?' }: HeaderProps) => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>{name}</h1>
    </div>
  );
};

const useResource = () => {
  const { data: resources } = useResourcesApi();
  const { data: resourceMarkers } = useAllResourceMarkersApi();
  const { setting: mapRadius } = useSettingsApi(
    'map_radius',
    DEFAULT_MAP_RADIUS,
  );
  const [coords] = useLocalStorage('MHGO_LAST_KNOWN_LOCATION', DEFAULT_COORDS);

  const params = new URLSearchParams(location.search);
  const resourceId = params.get('id');

  const resourceMarker = resourceMarkers.find(
    // @ts-expect-error _id in fact exists
    r => String(r._id) === resourceId,
  );
  const resource = resources.find(r => r.id === resourceMarker?.resourceId);

  const coordsResource = resourceMarker?.coords ?? [0, 0];
  const coordsUser = coords ?? [0, 0];

  const positionResource = new L.LatLng(coordsResource[0], coordsResource[1]);
  const positionUser = new L.LatLng(coordsUser[0], coordsUser[1]);

  const distance = positionUser.distanceTo(positionResource);
  const inRange = distance <= mapRadius!;

  return { resource, resourceMarker, inRange };
};

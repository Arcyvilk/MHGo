import { useState } from 'react';
import {
  CloseButton,
  Loader,
  QueryBoundary,
  Rays,
  Nuke,
  modifiers,
  useAllResourceMarkersApi,
  useResourcesApi,
} from '@mhgo/front';

import s from './ForageView.module.scss';
import { SoundSE, useSounds } from '@mhgo/front/hooks';

export const ForageView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [remainingHits, setRemainingHits] = useState(10);
  const { resource } = useResource();
  const { playSESound } = useSounds();

  const isActive = remainingHits > 0;
  const isOnCooldown = remainingHits <= 0;

  const onForage = () => {
    if (remainingHits > 0) {
      playSESound(SoundSE.CRYSTAL);
      setRemainingHits(remainingHits - 1);
    }
  };

  if (!resource) return null;
  return (
    <div className={s.forageView}>
      <Header name={resource.name} />
      <div className={s.forageView__resourceWrapper}>
        {isActive && <Rays />}
        {isOnCooldown && <Nuke />}
        <img
          className={modifiers(s, 'forageView__resource', {
            isActive,
            isOnCooldown,
          })}
          onClick={onForage}
          src={resource.img}
        />
      </div>
      <CloseButton />
    </div>
  );
};

const useResource = () => {
  const { data: resources } = useResourcesApi();
  const { data: resourceMarkers } = useAllResourceMarkersApi();

  const params = new URLSearchParams(location.search);
  const resourceId = params.get('id');

  const resourceMarker = resourceMarkers.find(
    // @ts-expect-error _id in fact exists
    r => String(r._id) === resourceId,
  );
  const resource = resources.find(r => r.id === resourceMarker?.resourceId);

  return { resource, resourceMarker };
};

type HeaderProps = { name?: string };
const Header = ({ name = '?' }: HeaderProps) => {
  return (
    <div className={s.header}>
      <h1 className={s.header__title}>{name}</h1>
    </div>
  );
};

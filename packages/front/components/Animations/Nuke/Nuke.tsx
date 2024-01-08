import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { SoundSE, useSounds } from '../../../hooks';
import { CDN_URL } from '../../../env';
import s from './Nuke.module.scss';

export const Nuke = () => {
  // This is a hack to restart a non-looped gif on page rerender.
  const [src, setSrc] = useState(`${CDN_URL}/misc/dummy.gif`);
  const { playSound } = useSounds(undefined);

  useEffect(() => {
    playSound(SoundSE.NUKE);
    setTimeout(() => {
      setSrc(`${CDN_URL}/misc/explosion.gif`);
    }, 0);
  }, []);

  return <img key={uuid()} className={s.nuke} src={src} />;
};

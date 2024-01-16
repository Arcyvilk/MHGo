import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { SoundSE, useSounds } from '../../../hooks';
import { CDN_URL } from '../../../env';
import s from './Nuke.module.scss';

export const Nuke = () => {
  // This is a hack to restart a non-looped gif on page rerender.
  const [src, setSrc] = useState('');
  const { playSound } = useSounds(undefined);

  useEffect(() => {
    setTimeout(() => {
      setSrc(`${CDN_URL}/misc/explosion.gif`);
    }, 0);
    playSound(SoundSE.NUKE);
  }, []);

  return (
    <>
      <span style={{ position: 'absolute', top: '20px' }}>Im loases</span>
      <span style={{ position: 'absolute', top: 0 }}>{src}</span>
      <img key={uuid()} className={s.nuke} src={src} />
    </>
  );
};

import { useEffect } from 'react';

import { SoundSE, useSounds } from '../../../hooks';
import { CDN_URL } from '../../../env';
import s from './Nuke.module.scss';

export const Nuke = () => {
  const { playSESound } = useSounds();

  useEffect(() => {
    playSESound(SoundSE.NUKE);
  }, []);

  return <img className={s.nuke} src={`${CDN_URL}/misc/explosion.gif`} />;
};

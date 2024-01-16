import { useEffect } from 'react';

import { useSounds, SoundSE } from '../../../hooks';
import s from './Death.module.scss';

export const Death = () => {
  const { playSound } = useSounds(undefined);

  useEffect(() => {
    playSound(SoundSE.DEATH);
  }, []);

  return <div className={s.death} />;
};

import { useEffect } from 'react';

import { SoundSE, useSounds } from '../../../hooks/useSounds';
import s from './Death.module.scss';

export const Death = () => {
  const { playSESound } = useSounds();

  useEffect(() => {
    playSESound(SoundSE.DEATH);
  }, []);

  return <div className={s.death} />;
};

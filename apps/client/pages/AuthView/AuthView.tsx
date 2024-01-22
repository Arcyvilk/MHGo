import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppContext } from '../../utils/context';

import s from './AuthView.module.scss';

export const AuthView = () => {
  const { isMusicPlaying, setIsMusicPlaying } = useAppContext();

  useEffect(() => {
    if (isMusicPlaying) {
      window.Howler.stop();
      setIsMusicPlaying(false);
    }
  }, [isMusicPlaying]);

  return (
    <div className={s.authView}>
      <div className={s.authView__wrapper}>
        <Outlet />
      </div>
    </div>
  );
};

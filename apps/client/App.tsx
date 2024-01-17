import { useEffect } from 'react';
import ReactHowler from 'react-howler';

import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { SoundBG, useSounds } from '@mhgo/front';

import { useAppContext } from './utils/context';
import { GlobalAchievements } from './containers';

import s from './App.module.scss';
import { Router } from './router';

const toastOptions: ToastContainerProps = {
  closeOnClick: true,
  theme: 'dark',
  autoClose: 2500,
  limit: 3,
  style: { fontSize: '16px', fontWeight: 400 },
};

export const App = () => {
  const { music, setMusic, musicVolume } = useAppContext();
  const { changeMusic } = useSounds(setMusic);

  useEffect(() => {
    const isInsideInstalledApp =
      window.matchMedia('(display-mode: standalone)').matches || // @ts-ignore
      window.navigator.standalone === true;
    if (isInsideInstalledApp) {
      // Size window after open the app
      window.resizeTo(400, 800);
    }
  }, []);

  useEffect(() => {
    changeMusic(SoundBG.SNOW_AND_CHILDREN);
  }, []);

  return (
    <div className={s.app}>
      {music && <ReactHowler src={music} playing loop volume={musicVolume} />}

      <GlobalAchievements />
      <Router />
      <ToastContainer {...toastOptions} />
    </div>
  );
};

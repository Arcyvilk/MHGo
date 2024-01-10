import { useEffect } from 'react';
import ReactHowler from 'react-howler';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { SoundBG, useSounds } from '@mhgo/front';

import {
  AchievementsView,
  CreditsView,
  EquipmentView,
  ForageView,
  HomeView,
  ItemBoxView,
  LoginView,
  NotImplementedView,
  QuestView,
  SettingsView,
  ShopView,
  YouView,
} from './pages';
import { PaintballView } from './pages/PaintballView';
import { FightView, PrepareView } from './pages/FightView';
import { MonsterGuideView } from './pages/MonsterGuideView';
import { useAppContext } from './utils/context';
import { GlobalAchievements } from './containers';

import s from './App.module.scss';
import { useUser } from './hooks/useUser';

const toastOptions: ToastContainerProps = {
  closeOnClick: true,
  theme: 'dark',
  autoClose: 2500,
  limit: 3,
  style: { fontSize: '16px', fontWeight: 400 },
};

export const App = () => {
  const { isLoggedIn } = useUser();
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

  const checkLogin = (Component: JSX.Element) => {
    if (isLoggedIn) return Component;
    else return <Navigate to="/login" replace={true} />;
  };

  return (
    <div className={s.app}>
      {music && <ReactHowler src={music} playing loop volume={musicVolume} />}
      <BrowserRouter>
        <GlobalAchievements />
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/" element={checkLogin(<HomeView />)} />

          {/* INTERACTIVE PATHS */}
          <Route path="/prepare" element={checkLogin(<PrepareView />)} />
          <Route path="/fight" element={checkLogin(<FightView />)} />
          <Route path="/forage" element={checkLogin(<ForageView />)} />

          {/* STATIC PATHS */}
          <Route
            path="/achievements"
            element={checkLogin(<AchievementsView />)}
          />
          <Route path="/guide" element={checkLogin(<MonsterGuideView />)} />
          <Route path="/equipment" element={checkLogin(<EquipmentView />)} />
          <Route path="/items" element={checkLogin(<ItemBoxView />)} />
          <Route path="/paintball" element={checkLogin(<PaintballView />)} />
          <Route path="/settings" element={checkLogin(<SettingsView />)} />
          <Route path="/shop" element={checkLogin(<ShopView />)} />
          <Route path="/quest" element={checkLogin(<QuestView />)} />
          <Route path="/you" element={checkLogin(<YouView />)} />
          <Route path="/credits" element={checkLogin(<CreditsView />)} />
          <Route path="/404" element={checkLogin(<NotImplementedView />)} />
        </Routes>
      </BrowserRouter>
      <ToastContainer {...toastOptions} />
    </div>
  );
};

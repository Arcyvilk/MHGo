import { FC, PropsWithChildren, useEffect } from 'react';
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
import { ENV } from './env';

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
      <BrowserRouter>
        <GlobalAchievements />
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomeView />
              </RequireAuth>
            }
          />

          {/* INTERACTIVE PATHS */}
          <Route
            path="/prepare"
            element={
              <RequireAuth>
                <PrepareView />
              </RequireAuth>
            }
          />
          <Route
            path="/fight"
            element={
              <RequireAuth>
                <FightView />
              </RequireAuth>
            }
          />
          <Route
            path="/forage"
            element={
              <RequireAuth>
                <ForageView />
              </RequireAuth>
            }
          />

          {/* STATIC PATHS */}
          <Route
            path="/achievements"
            element={
              <RequireAuth>
                <AchievementsView />
              </RequireAuth>
            }
          />
          <Route
            path="/guide"
            element={
              <RequireAuth>
                <MonsterGuideView />
              </RequireAuth>
            }
          />
          <Route
            path="/equipment"
            element={
              <RequireAuth>
                <EquipmentView />
              </RequireAuth>
            }
          />
          <Route
            path="/items"
            element={
              <RequireAuth>
                <ItemBoxView />
              </RequireAuth>
            }
          />
          <Route
            path="/paintball"
            element={
              <RequireAuth>
                <PaintballView />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <SettingsView />
              </RequireAuth>
            }
          />
          <Route
            path="/shop"
            element={
              <RequireAuth>
                <ShopView />
              </RequireAuth>
            }
          />
          <Route
            path="/quest"
            element={
              <RequireAuth>
                <QuestView />
              </RequireAuth>
            }
          />
          <Route
            path="/you"
            element={
              <RequireAuth>
                <YouView />
              </RequireAuth>
            }
          />
          <Route
            path="/credits"
            element={
              <RequireAuth>
                <CreditsView />
              </RequireAuth>
            }
          />
          <Route
            path="/404"
            element={
              <RequireAuth>
                <NotImplementedView />
              </RequireAuth>
            }
          />

          {/* AUTH */}
          <Route path="/login" element={<LoginView />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer {...toastOptions} />
    </div>
  );
};

const RequireAuth: FC<{ children: React.ReactElement }> = ({
  children,
}: PropsWithChildren) => {
  const { isLoggedIn } = useUser();
  const isDev = ENV === 'development';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
};

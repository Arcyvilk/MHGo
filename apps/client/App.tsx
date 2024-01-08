import { useEffect } from 'react';
import ReactHowler from 'react-howler';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { SoundBG, useSounds } from '@mhgo/front';

import {
  AchievementsView,
  CreditsView,
  EquipmentView,
  ForageView,
  HomeView,
  ItemBoxView,
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

import s from './App.module.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <div className={s.app}>
        {music && <ReactHowler src={music} playing loop volume={musicVolume} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeView />} />

            {/* INTERACTIVE PATHS */}
            <Route path="/prepare" element={<PrepareView />} />
            <Route path="/fight" element={<FightView />} />
            <Route path="/forage" element={<ForageView />} />

            {/* STATIC PATHS */}
            <Route path="/guide" element={<MonsterGuideView />} />
            <Route path="/equipment" element={<EquipmentView />} />
            <Route path="/items" element={<ItemBoxView />} />
            <Route path="/achievements" element={<AchievementsView />} />
            <Route path="/paintball" element={<PaintballView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/shop" element={<ShopView />} />
            <Route path="/quest" element={<QuestView />} />
            <Route path="/you" element={<YouView />} />
            <Route path="/credits" element={<CreditsView />} />
            <Route path="/404" element={<NotImplementedView />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer {...toastOptions} />
      </div>
    </QueryClientProvider>
  );
};

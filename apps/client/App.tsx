import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ToastContainer, ToastContainerProps } from 'react-toastify';

import {
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

import s from './App.module.scss';
import { useEffect } from 'react';
import { PaintballView } from './pages/PaintballView';
import { FightView, PrepareView } from './pages/FightView';
import { MonsterGuideView } from './pages/MonsterGuideView';
import { SoundBG, useSounds } from '@mhgo/front';

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
  style: { fontSize: '16px', fontWeight: 400 },
};

export const App = () => {
  const { playBgSound } = useSounds();

  useEffect(() => {
    const isInsideInstalledApp =
      window.matchMedia('(display-mode: standalone)').matches || // @ts-ignore
      window.navigator.standalone === true;
    if (isInsideInstalledApp) {
      // Size window after open the app
      window.resizeTo(400, 800);
    }
    playBgSound(SoundBG.BEWITCHING, true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={s.app}>
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
            <Route path="/paintball" element={<PaintballView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/shop" element={<ShopView />} />
            <Route path="/quest" element={<QuestView />} />
            <Route path="/you" element={<YouView />} />
            <Route path="/404" element={<NotImplementedView />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer {...toastOptions} />
      </div>
    </QueryClientProvider>
  );
};

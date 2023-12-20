import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import {
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export const App = () => {
  useEffect(() => {
    const isInsideInstalledApp =
      window.matchMedia('(display-mode: standalone)').matches || // @ts-ignore
      window.navigator.standalone === true;
    if (isInsideInstalledApp) {
      // Size window after open the app
      window.resizeTo(400, 600);
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <div className={s.app}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/inventory" element={<NotImplementedView />} />
            <Route path="/items" element={<ItemBoxView />} />
            <Route path="/paintball" element={<NotImplementedView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/shop" element={<ShopView />} />
            <Route path="/quest" element={<QuestView />} />
            <Route path="/you" element={<YouView />} />
            <Route path="/404" element={<NotImplementedView />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};

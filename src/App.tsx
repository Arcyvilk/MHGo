import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import s from './App.module.scss';
import { HomeView, QuestView, YouView } from './pages';
import { NotImplementedView } from './pages/NotImplementedView';
import { ShopView } from './pages/ShopView';
import { ItemBoxView } from './pages/ItemBoxView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={s.app}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/inventory" element={<NotImplementedView />} />
            <Route path="/items" element={<ItemBoxView />} />
            <Route path="/paintball" element={<NotImplementedView />} />
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

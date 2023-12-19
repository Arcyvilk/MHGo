import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import s from './App.module.scss';
import { HomeView, InventoryView, QuestView, YouView } from './pages';
import { SimpleButton } from './components/SimpleButton';

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
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/items" element={<NotImplementedView />} />
            <Route path="/paintball" element={<NotImplementedView />} />
            <Route path="/shop" element={<NotImplementedView />} />
            <Route path="/quest" element={<QuestView />} />
            <Route path="/you" element={<YouView />} />
            <Route path="/404" element={<NotImplementedView />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};

const NotImplementedView = () => {
  const navigate = useNavigate();
  const onGoHome = () => navigate(-1);

  return (
    <div>
      <h1>NOT IMPLEMENTED YET</h1>
      <SimpleButton onClick={onGoHome} label="Go back home" />
    </div>
  );
};

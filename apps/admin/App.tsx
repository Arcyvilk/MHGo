import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ToastContainer, ToastContainerProps } from 'react-toastify';

import { entries } from './utils/entries';
import { Sidebar } from './containers';

import s from './App.module.scss';
import 'leaflet/dist/leaflet.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
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
  useEffect(() => {
    const isInsideInstalledApp =
      window.matchMedia('(display-mode: standalone)').matches || // @ts-expect-error ts is stupid
      window.navigator.standalone === true;
    if (isInsideInstalledApp) {
      // Size window after open the app
      window.resizeTo(400, 800);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={s.app}>
        <BrowserRouter>
          <Sidebar />
          <RouteWrapper>
            <Routes>
              {entries.map(entry => (
                <Route
                  key={entry.id}
                  path={entry.link}
                  element={entry.component}
                />
              ))}
            </Routes>
          </RouteWrapper>
        </BrowserRouter>
        <ToastContainer {...toastOptions} />
      </div>
    </QueryClientProvider>
  );
};

const RouteWrapper = ({ children }: React.PropsWithChildren) => {
  return <div className={s.app__routeWrapper}>{children}</div>;
};

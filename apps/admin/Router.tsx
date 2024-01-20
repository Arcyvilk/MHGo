import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { Loader } from '@mhgo/front';

import { entries } from './utils/entries';
import { LoginView, NoPermissions } from './pages';
import { App } from './App';

import 'leaflet/dist/leaflet.css';
import s from './App.module.scss';

const toastOptions: ToastContainerProps = {
  closeOnClick: true,
  theme: 'dark',
  autoClose: 2500,
  limit: 3,
  style: { fontSize: '16px', fontWeight: 400 },
};

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/auth',
      children: [
        // AUTH ROUTES
        { path: '/auth/login', element: <LoginView /> },
        { path: '/auth/forbidden', element: <NoPermissions /> },
      ],
    },
    // INTERACTIVE ROUTES
    {
      path: '/',
      element: <App />,
      children: entries.map(entry => ({
        path: entry.link,
        element: entry.component,
      })),
    },
  ]);

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
    <div className={s.app}>
      <ToastContainer {...toastOptions} />
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </div>
  );
};

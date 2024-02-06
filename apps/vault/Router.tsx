import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { Loader } from '@mhgo/front';

import {
  AdventureSelectView,
  AuthView,
  BannedView,
  HomeView,
  LoginView,
  NoPermissions,
} from './pages';
import { App } from './App';

export const Router = () => {
  const router = createBrowserRouter([
    // AUTH ROUTES
    {
      path: '/auth',
      element: <AuthView />,
      children: [
        { path: '/auth/login', element: <LoginView /> },
        { path: '/auth/ban', element: <BannedView /> },
        { path: '/auth/forbidden', element: <NoPermissions /> },
        {
          path: '/auth/adventure',
          element: <AdventureSelectView />,
        },
      ],
    },
    // INTERACTIVE PATHS
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: <HomeView />,
        },
      ],
    },
  ]);

  return (
    <>
      <ToastContainer {...toastOptions} />
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </>
  );
};

const toastOptions: ToastContainerProps = {
  closeOnClick: true,
  theme: 'dark',
  autoClose: 2500,
  limit: 3,
  style: { fontSize: '16px', fontWeight: 400 },
};

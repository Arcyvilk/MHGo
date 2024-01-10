import { FC, PropsWithChildren, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, ToastContainerProps } from 'react-toastify';

import { entries } from './utils/entries';
import { useMe } from './utils/useMe';
import { Sidebar } from './containers';

import s from './App.module.scss';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from './utils/context';
import { LoginView, NoPermissions } from './pages';
import { modifiers } from '@mhgo/front';

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
    <div className={s.app}>
      <BrowserRouter>
        <Sidebar />
        <RouteWrapper>
          <Routes>
            {entries.map(entry => (
              <Route
                key={entry.id}
                path={entry.link}
                element={<RequireAuth>{entry.component}</RequireAuth>}
              />
            ))}
          </Routes>
        </RouteWrapper>
      </BrowserRouter>
      <ToastContainer {...toastOptions} />
    </div>
  );
};

const RouteWrapper = ({ children }: React.PropsWithChildren) => {
  const { isLoggedIn, isAdmin } = useMe();
  const isFullScreen = !isLoggedIn || !isAdmin;

  return (
    <div className={modifiers(s, 'app__routeWrapper', { isFullScreen })}>
      {children}
    </div>
  );
};

const RequireAuth: FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  const { isAwaitingModApproval, isModApproved, isLoggedIn, isAdmin } = useMe();

  if (!isLoggedIn) {
    return <LoginView />;
  }
  if (!isAdmin) {
    return <NoPermissions />;
  }
  if (isAwaitingModApproval === false || isModApproved === true) {
    return children;
  }
  return children;
};

import { FC, PropsWithChildren, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { Loader, QueryBoundary, modifiers } from '@mhgo/front';

import { entries } from './utils/entries';
import { useMe } from './utils/useMe';
import { Sidebar } from './containers';

import s from './App.module.scss';
import 'leaflet/dist/leaflet.css';
import { LoginView, NoPermissions } from './pages';

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
            <Route path="/login" element={<LoginView />} />
            <Route path="/forbidden" element={<NoPermissions />} />
          </Routes>
        </RouteWrapper>
      </BrowserRouter>
      <ToastContainer {...toastOptions} />
    </div>
  );
};

const RouteWrapper = ({ children }: React.PropsWithChildren) => {
  const { isLoggedIn, isAdmin } = useMe();
  const isFullScreen = isLoggedIn === false || isAdmin === false;

  return (
    <div className={modifiers(s, 'app__routeWrapper', { isFullScreen })}>
      {children}
    </div>
  );
};

const RequireAuth: FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  return (
    <QueryBoundary fallback={<Loader />}>
      <LoadAuth>{children}</LoadAuth>
    </QueryBoundary>
  );
};

const LoadAuth = ({ children }: PropsWithChildren) => {
  const { isAwaitingModApproval, isModApproved, isLoggedIn, isAdmin } = useMe();

  if (isLoggedIn === false) {
    return <Navigate to="/login" replace={true} />;
  }
  if (isAdmin === false) {
    return <Navigate to="/forbidden" replace={true} />;
  }
  if (isAwaitingModApproval === false || isModApproved === true) {
    return children;
  }
  return children;
};

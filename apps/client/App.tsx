import { FC, PropsWithChildren, useEffect } from 'react';
import ReactHowler from 'react-howler';
import { Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { ToastContainer, ToastContainerProps } from 'react-toastify';

import { Loader, QueryBoundary, SoundBG, useSounds } from '@mhgo/front';
import { useAppContext } from './utils/context';
import { GlobalAchievements } from './containers';

import s from './App.module.scss';
import { useMe } from './hooks/useAuth';

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
    <RequireAuth>
      <div className={s.app}>
        <ScrollRestoration
          getKey={location => {
            const paths = ['/equipment', '/you'];
            // Restore scroll if query params are present and it's one of the
            // specified paths
            const shouldRestoreScroll =
              paths.includes(location.pathname) &&
              !location.state?.preventRestore;
            const scrollRestoration = shouldRestoreScroll
              ? location.pathname
              : location.key;
            return scrollRestoration;
          }}
        />
        {music && <ReactHowler src={music} playing loop volume={musicVolume} />}
        <GlobalAchievements />
        <ToastContainer {...toastOptions} />
        <Outlet />
      </div>
    </RequireAuth>
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
  const {
    isAwaitingModApproval,
    isModApproved,
    isBanned,
    isLoggedIn,
    isPending,
  } = useMe();

  // const isDev = ENV === 'development';
  // if (isDev) return children;

  if (isPending === true) {
    return <Navigate to="/auth/loading" replace={true} />;
  }
  if (isBanned === true) {
    return <Navigate to="/auth/ban" replace={true} />;
  }
  if (isAwaitingModApproval === true || isModApproved === false) {
    return <Navigate to="/auth/awaiting" replace={true} />;
  }
  if (isLoggedIn === false) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  if (isAwaitingModApproval === false || isModApproved === true) {
    return children;
  }
  return;
};

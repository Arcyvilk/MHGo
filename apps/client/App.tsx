import { FC, PropsWithChildren, useEffect } from 'react';
import { Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import {
  Loader,
  LoadingBar,
  QueryBoundary,
  SoundBG,
  usePrefetch,
  useSounds,
} from '@mhgo/front';

import { useMe } from './hooks/useAuth';
import { GlobalAchievements } from './containers';

import s from './App.module.scss';
import { useAppContext } from './utils/context';

export const App = () => {
  const { setMusic, isMusicPlaying, setIsMusicPlaying } = useAppContext();
  const { changeMusic } = useSounds(setMusic);

  useEffect(() => {
    if (!isMusicPlaying) {
      changeMusic(SoundBG.SNOW_AND_CHILDREN);
      setIsMusicPlaying(true);
    }
  }, [isMusicPlaying]);

  return (
    <RequireAuth>
      <div className={s.app} id="app_root">
        <ScrollRestoration
          getKey={location => {
            const paths = ['/equipment'];
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
        <GlobalAchievements />

        <Outlet />
      </div>
    </RequireAuth>
  );
};

const RequireAuth: FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  return (
    <QueryBoundary fallback={<Loader fullScreen />}>
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
  const { isPrefetch, progress } = usePrefetch(isLoggedIn);

  // const isDev = ENV === 'development';
  // if (isDev) return children;

  if (isLoggedIn && !isPrefetch) {
    return <PrefetchScreen progress={progress} />;
  }
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

const PrefetchScreen = ({ progress }: { progress: number }) => (
  <div className={s.prefetch}>
    <img
      className={s.prefetch__logo}
      src="https://cdn.arcyvilk.com/mhgo/misc/logo.png"
      alt="logo"
    />
    <LoadingBar max={100} current={Math.round(progress)} />
  </div>
);

import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { chooseRandom } from '@mhgo/utils';
import {
  Loader,
  LoadingBar,
  QueryBoundary,
  SoundBG,
  logo,
  useInterval,
  usePrefetch,
  useSettingsApi,
  useSounds,
} from '@mhgo/front';

import { useMe } from './hooks/useAuth';
import { GlobalAchievements } from './containers';
import { useAppContext } from './utils/context';

import s from './App.module.scss';

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
  const { isPrefetch, progress, maxProgress } = usePrefetch(isLoggedIn);

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
  if (isLoggedIn && !isPrefetch) {
    return <PrefetchScreen progress={progress} maxProgress={maxProgress} />;
  }
  if (isAwaitingModApproval === false || isModApproved === true) {
    return children;
  }
  return;
};

const PrefetchScreen = ({
  progress,
  maxProgress,
}: {
  progress: number;
  maxProgress: number;
}) => {
  const { setting: loadingTips } = useSettingsApi('loading_screen_tips', [
    'Loading assets...',
  ]);
  const [currentTip, setCurrentTip] = useState(chooseRandom(loadingTips));

  const onClick = () => {
    const newTip = chooseRandom(loadingTips);
    setCurrentTip(newTip);
  };

  useInterval(() => {
    const currentTipPool = loadingTips.filter(tip => tip !== currentTip);
    setCurrentTip(chooseRandom(currentTipPool));
  }, 5000);

  useEffect(() => {
    return () => {
      const locationWithoutSearch = window.location.href
        .replace(window.location.search, '')
        .replace('?', '');
      window.history.replaceState({}, document.title, locationWithoutSearch);
    };
  }, []);

  return (
    <div className={s.prefetch} onClick={onClick}>
      <img className={s.prefetch__logo} src={logo} alt="logo" />
      <LoadingBar
        max={maxProgress}
        current={Math.round(progress)}
        tip={currentTip}
      />
    </div>
  );
};

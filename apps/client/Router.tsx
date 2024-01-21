import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import ReactHowler from 'react-howler';
import {
  Loader,
  LoadingBar,
  SoundBG,
  usePrefetch,
  useSounds,
} from '@mhgo/front';

import { useAppContext } from './utils/context';
import {
  AchievementsView,
  AwaitingApprovalView,
  BannedView,
  CompanionView,
  CreditsView,
  EquipmentView,
  ForageView,
  HomeView,
  ItemBoxView,
  LoadingView,
  LoginView,
  NotImplementedView,
  QuestView,
  SettingsView,
  ShopView,
  SignInView,
  YouView,
} from './pages';
import { PaintballView } from './pages/PaintballView';
import { FightView, PrepareView } from './pages/FightView';
import { MonsterGuideView } from './pages/MonsterGuideView';

import { App } from './App';

import s from './App.module.scss';

export const Router = () => {
  const { music, setMusic, musicVolume } = useAppContext();
  const { changeMusic } = useSounds(setMusic);
  const { isPrefetch, progress } = usePrefetch();

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

  const router = createBrowserRouter([
    {
      path: '/auth',
      children: [
        // AUTH ROUTES
        { path: '/auth/loading', element: <LoadingView /> },
        { path: '/auth/login', element: <LoginView /> },
        { path: '/auth/signin', element: <SignInView /> },
        { path: '/auth/ban', element: <BannedView /> },
        { path: '/auth/awaiting', element: <AwaitingApprovalView /> },
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
        {
          path: '/prepare',
          element: <PrepareView />,
        },
        {
          path: '/fight',
          element: <FightView />,
        },
        {
          path: '/forage',
          element: <ForageView />,
        },
        // STATIC PATHS
        {
          path: '/achievements',
          element: <AchievementsView />,
        },
        {
          path: '/guide',
          element: <MonsterGuideView />,
        },
        {
          path: '/equipment',
          element: <EquipmentView />,
        },
        {
          path: '/items',
          element: <ItemBoxView />,
        },
        {
          path: '/paintball',
          element: <PaintballView />,
        },
        {
          path: '/settings',
          element: <SettingsView />,
        },
        {
          path: '/shop',
          element: <ShopView />,
        },
        {
          path: '/quest',
          element: <QuestView />,
        },
        {
          path: '/you',
          element: <YouView />,
        },
        {
          path: '/companion',
          element: <CompanionView />,
        },
        {
          path: '/credits',
          element: <CreditsView />,
        },
        {
          path: '/404',
          element: <NotImplementedView />,
        },
      ],
    },
  ]);

  if (!isPrefetch) return <PrefetchScreen progress={progress} />;
  return (
    <>
      {music && <ReactHowler src={music} playing loop volume={musicVolume} />}
      <ToastContainer {...toastOptions} />
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </>
  );
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

const toastOptions: ToastContainerProps = {
  closeOnClick: true,
  theme: 'dark',
  autoClose: 2500,
  limit: 3,
  style: { fontSize: '16px', fontWeight: 400 },
};

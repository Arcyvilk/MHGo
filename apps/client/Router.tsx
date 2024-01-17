import { FC, PropsWithChildren } from 'react';
import {
  Navigate,
  ScrollRestoration,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { Loader, QueryBoundary } from '@mhgo/front';

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
import { useMe } from './hooks/useAuth';

export const Router = () => {
  const router = createBrowserRouter([
    // INTERACTIVE PATHS
    {
      path: '/',
      element: (
        <RequireAuth>
          <HomeView />
        </RequireAuth>
      ),
    },
    {
      path: '/prepare',
      element: (
        <RequireAuth>
          <PrepareView />
        </RequireAuth>
      ),
    },
    {
      path: '/fight',
      element: (
        <RequireAuth>
          <FightView />
        </RequireAuth>
      ),
    },
    {
      path: '/forage',
      element: (
        <RequireAuth>
          <ForageView />
        </RequireAuth>
      ),
    },
    // STATIC PATHS
    {
      path: '/achievements',
      element: (
        <RequireAuth>
          <AchievementsView />
        </RequireAuth>
      ),
    },
    {
      path: '/guide',
      element: (
        <RequireAuth>
          <MonsterGuideView />
        </RequireAuth>
      ),
    },
    {
      path: '/equipment',
      element: (
        <RequireAuth>
          <EquipmentView />
        </RequireAuth>
      ),
    },
    {
      path: '/items',
      element: (
        <RequireAuth>
          <ItemBoxView />
        </RequireAuth>
      ),
    },
    {
      path: '/paintball',
      element: (
        <RequireAuth>
          <PaintballView />
        </RequireAuth>
      ),
    },
    {
      path: '/settings',
      element: (
        <RequireAuth>
          <SettingsView />
        </RequireAuth>
      ),
    },
    {
      path: '/shop',
      element: (
        <RequireAuth>
          <ShopView />
        </RequireAuth>
      ),
    },
    {
      path: '/quest',
      element: (
        <RequireAuth>
          <QuestView />
        </RequireAuth>
      ),
    },
    {
      path: '/you',
      element: (
        <RequireAuth>
          <YouView />
        </RequireAuth>
      ),
    },
    {
      path: '/companion',
      element: (
        <RequireAuth>
          <CompanionView />
        </RequireAuth>
      ),
    },
    {
      path: '/credits',
      element: (
        <RequireAuth>
          <CreditsView />
        </RequireAuth>
      ),
    },
    {
      path: '/404',
      element: (
        <RequireAuth>
          <NotImplementedView />
        </RequireAuth>
      ),
    },
    // AUTH ROUTES
    { path: '/loading', element: <LoadingView /> },
    { path: '/login', element: <LoginView /> },
    { path: '/signin', element: <SignInView /> },
    { path: '/ban', element: <BannedView /> },
    { path: '/awaiting', element: <AwaitingApprovalView /> },
  ]);

  return <RouterProvider router={router} />;
};

const RequireAuth: FC<{ children: React.ReactNode }> = ({
  children,
}: PropsWithChildren) => {
  return (
    <QueryBoundary fallback={<Loader />}>
      <ScrollRestoration
        getKey={location => {
          const paths = ['/equipment'];
          return paths.includes(location.pathname)
            ? // equipment restore by pathname
              location.pathname
            : // everything else by location like the browser
              location.key;
        }}
      />
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
    return <Navigate to="/loading" replace={true} />;
  }
  if (isBanned === true) {
    return <Navigate to="/ban" replace={true} />;
  }
  if (isAwaitingModApproval === true || isModApproved === false) {
    return <Navigate to="/awaiting" replace={true} />;
  }
  if (isLoggedIn === false) {
    return <Navigate to="/login" replace={true} />;
  }
  if (isAwaitingModApproval === false || isModApproved === true) {
    return children;
  }
  return;
};

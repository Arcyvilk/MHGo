import { Outlet } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader, QueryBoundary, modifiers } from '@mhgo/front';

import { Sidebar } from './containers';
import { useMe } from './utils/useMe';

import s from './App.module.scss';
import { useAppContext } from './utils/context';

export const App = () => {
  const { isLoggedIn, isAdmin } = useMe();
  const { adventure } = useAppContext();
  const isFullScreen = isLoggedIn === false || isAdmin === false;

  return (
    <RequireAuth>
      <Sidebar title={`Current adventure: ${adventure.id.toUpperCase()}`} />
      <div className={modifiers(s, 'app__routeWrapper', { isFullScreen })}>
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
  const { isAwaitingModApproval, isModApproved, isLoggedIn, isAdmin } = useMe();

  if (isLoggedIn === false) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  if (isAdmin === false) {
    return <Navigate to="/auth/forbidden" replace={true} />;
  }
  if (isAwaitingModApproval === false || isModApproved === true) {
    return children;
  }
  return children;
};

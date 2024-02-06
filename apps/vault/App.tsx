import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader, QueryBoundary } from '@mhgo/front';

import { useMe } from './hooks/useAuth';

import s from './App.module.scss';

export const App = () => {
  return (
    <RequireAuth>
      <div className={s.app} id="app_root">
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
    isAdmin,
    isAwaitingModApproval,
    isModApproved,
    isBanned,
    isLoggedIn,
  } = useMe();

  const isAwaiting = isAwaitingModApproval === true || isModApproved === false;
  if (isLoggedIn === false) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  if (isAdmin === false || isAwaiting) {
    return <Navigate to="/auth/forbidden" replace={true} />;
  }
  if (isBanned === true) {
    return <Navigate to="/auth/ban" replace={true} />;
  }
  if (isAwaitingModApproval === false || isModApproved === true) {
    return children;
  }
  return;
};

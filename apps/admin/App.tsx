import { Outlet } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { AdventureSelect, Loader, QueryBoundary, modifiers } from '@mhgo/front';

import { Sidebar } from './containers';
import { useMe } from './utils/useMe';
import { useAppContext } from './utils/context';

import s from './App.module.scss';

export const App = () => {
  const { isLoggedIn, isAdmin } = useMe();
  const { adventure, setAdventure } = useAppContext();

  const isFullScreen = isLoggedIn === false || isAdmin === false;

  const dupa = true;
  if (dupa) throw new Error('I am an admin error!');

  const onAdventureSwitch = (id: string) => {
    setAdventure({ id });
  };

  return (
    <RequireAuth>
      <Sidebar
        title={
          <AdventureSelect
            currentAdventure={adventure}
            onAdventureSwitch={onAdventureSwitch}
          />
        }
      />
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

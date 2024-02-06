import { Navigate } from 'react-router-dom';
import { Button, Icon, Loader, QueryBoundary, Size } from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';

import s from './AuthView.module.scss';

export const NoPermissions = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    isAdmin,
    isAwaitingModApproval,
    isModApproved,
    isLoggedIn,
    logoutUser,
  } = useMe();

  const isApproved = !isAwaitingModApproval && isModApproved;

  if (!isLoggedIn) return <Navigate to="/auth/login" replace={true} />;
  if (isApproved && isAdmin) return <Navigate to="/" replace={true} />;

  return (
    <div className={s.loginView}>
      <div className={s.loginView__wrapper}>
        <div className={s.loginView__title}>Forbidden</div>
        <div className={s.loginView__desc}>
          The user you are logged as does not have permissions to view this
          page.
        </div>
        <Button
          key="logout"
          onClick={logoutUser}
          label={
            <>
              <Icon icon="Logout" size={Size.MICRO} />
              Logout
            </>
          }
        />
      </div>
    </div>
  );
};

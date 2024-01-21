import { Navigate } from 'react-router-dom';
import { Button, Icon, Loader, QueryBoundary, Size } from '@mhgo/front';
import { useMe } from '../../utils/useMe';

import s from './LoginView.module.scss';

export const NoPermissions = () => (
  <QueryBoundary fallback={<Loader fullScreen />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { isAdmin, isLoggedIn, logoutUser } = useMe();

  if (!isLoggedIn) return <Navigate to="/login" replace={true} />;
  if (isAdmin) return <Navigate to="/" replace={true} />;
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

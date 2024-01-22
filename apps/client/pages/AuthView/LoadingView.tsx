import { Navigate } from 'react-router-dom';
import { Loader, logo } from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';

import s from './AuthView.module.scss';

export const LoadingView = () => {
  const { isPending, isLoggedIn } = useMe();

  if (!isLoggedIn) return <Navigate to="/auth/login" replace={true} />;
  if (!isPending) return <Navigate to="/" replace={true} />;

  return (
    <>
      <img className={s.authView__logo} src={logo} alt="logo" />
      <Loader />
    </>
  );
};

import { Navigate } from 'react-router-dom';
import { Loader } from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';
import s from './AuthView.module.scss';
import { APP_LOGO } from '../../utils/consts';

export const LoadingView = () => {
  const { isPending } = useMe();

  if (!isPending) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <>
      <img className={s.authView__logo} src={APP_LOGO} alt="logo" />
      <Loader />
    </>
  );
};

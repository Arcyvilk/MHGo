import { Navigate } from 'react-router-dom';
import { Loader } from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';
import s from './AuthView.module.scss';

export const LoadingView = () => {
  const { isPending } = useMe();

  if (!isPending) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div className={s.authView}>
      <div className={s.authView__wrapper}>
        <img
          className={s.authView__logo}
          src="https://cdn.arcyvilk.com/mhgo/misc/logo.png"
          alt="logo"
        />
        <Loader withPadding />
      </div>
    </div>
  );
};

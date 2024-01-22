import { Navigate } from 'react-router-dom';
import { useMe } from '../../hooks/useAuth';
import s from './AuthView.module.scss';
import { APP_LOGO } from '../../utils/consts';

export const BannedView = () => {
  const { isLoggedIn, isBanned, banReason, banEndDate } = useMe();

  if (!isLoggedIn) return <Navigate to="/auth/login" replace={true} />;
  if (!isBanned) return <Navigate to="/" replace={true} />;

  return (
    <>
      <img className={s.authView__logo} src={APP_LOGO} alt="logo" />
      <div className={s.authView__title}>User banned</div>
      {banEndDate && (
        <div className={s.authView__desc}>
          Until {new Date(banEndDate).toLocaleDateString()},{' '}
          {new Date(banEndDate).toLocaleTimeString()}
        </div>
      )}
      <div className={s.authView__desc}>
        Ban reason: <span className={s.authView__detail}>{banReason}</span>
      </div>
    </>
  );
};

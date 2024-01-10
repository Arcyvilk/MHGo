import { Navigate } from 'react-router-dom';
import { useMe } from '../../hooks/useAuth';
import s from './AuthView.module.scss';

export const BannedView = () => {
  const { isBanned, banReason, banEndDate } = useMe();

  if (!isBanned) {
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
      </div>
    </div>
  );
};

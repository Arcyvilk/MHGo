import { Navigate } from 'react-router-dom';
import { useMe } from '../../hooks/useAuth';
import s from './AuthView.module.scss';
import { APP_LOGO, DEFAULT_COORDS } from '../../utils/consts';

export const AwaitingApprovalView = () => {
  const { isAwaitingModApproval, isModApproved, isLoggedIn } = useMe();

  if (!isLoggedIn) return <Navigate to="/auth/login" replace={true} />;
  if (!isAwaitingModApproval && isModApproved) {
    return <Navigate to="/" replace={true} />;
  }

  DEFAULT_COORDS;

  return (
    <>
      <img className={s.authView__logo} src={APP_LOGO} alt="logo" />
      <div className={s.authView__title}>On the waiting list...</div>
      <div className={s.authView__desc}>
        Be patient - our administrators are verifying your account. You will get
        beta access soon!
      </div>
    </>
  );
};

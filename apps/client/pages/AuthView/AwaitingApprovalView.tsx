import { Navigate } from 'react-router-dom';
import { useMe } from '../../hooks/useAuth';
import s from './AuthView.module.scss';

export const AwaitingApprovalView = () => {
  const { isAwaitingModApproval, isModApproved } = useMe();

  if (!isAwaitingModApproval && isModApproved) {
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
        <div className={s.authView__title}>On the waiting list...</div>
        <div className={s.authView__desc}>
          Be patient - our administrators are verifying your account. You will
          get beta access soon!
        </div>
      </div>
    </div>
  );
};

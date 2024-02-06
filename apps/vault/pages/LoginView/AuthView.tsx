import { Outlet } from 'react-router-dom';

import s from './AuthView.module.scss';

export const AuthView = () => {
  return (
    <div className={s.authView}>
      <div className={s.authView__wrapper}>
        <Outlet />
      </div>
    </div>
  );
};

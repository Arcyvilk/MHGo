import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Button,
  Icon,
  Input,
  Loader,
  QueryBoundary,
  Size,
  logo,
} from '@mhgo/front';
import { useMe } from '../../utils/useMe';

import s from './LoginView.module.scss';

export const LoginView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { isLoggedIn, loginUser, isLoginPending } = useMe();
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');

  const onLogin = () => {
    loginUser(userName, pwd);
  };

  if (isLoggedIn) return <Navigate to="/" replace={true} />;
  return (
    <div className={s.loginView}>
      <div className={s.loginView__wrapper}>
        <img className={s.loginView__logo} src={logo} alt="logo" />
        <div className={s.loginView__title}>Login</div>
        <div className={s.loginView__inputs}>
          <Input
            name="login_name"
            label="Username"
            value={userName}
            setValue={setUserName}
            onKeyDown={event => event.key === 'Enter' && onLogin()}
            style={{ width: '275px', maxWidth: '100%' }}
          />
          <Input
            name="login_pwd"
            label="Password"
            value={pwd}
            setValue={setPwd}
            type="password"
            onKeyDown={event => event.key === 'Enter' && onLogin()}
            style={{ width: '275px', maxWidth: '100%' }}
          />
        </div>
        {isLoginPending ? (
          <Icon icon="Spin" spin size={Size.BIG} />
        ) : (
          <div className={s.loginView__inputs}>
            <Button
              variant={Button.Variant.ACTION}
              label="Log in"
              onClick={onLogin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

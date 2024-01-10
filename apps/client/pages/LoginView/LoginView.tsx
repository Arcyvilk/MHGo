import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Icon, Input, Loader, Size } from '@mhgo/front';
import { useUser } from '../../hooks/useUser';

import s from './LoginView.module.scss';
import { toast } from 'react-toastify';

export const LoginView = () => {
  const { isLoggedIn, loginUser, isPending } = useUser();
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');

  const onLogin = () => {
    loginUser(userName, pwd);
  };

  const onSignIn = () => {
    toast.info('Coming soon!');
  };

  if (isLoggedIn) return <Navigate to="/" replace={true} />;
  return (
    <div className={s.loginView}>
      <div className={s.loginView__wrapper}>
        <img
          className={s.loginView__logo}
          src="https://cdn.arcyvilk.com/mhgo/misc/logo.png"
          alt="logo"
        />
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
        {isPending ? (
          <Icon icon="Spin" spin size={Size.BIG} />
        ) : (
          <div className={s.loginView__inputs}>
            <Button
              variant={Button.Variant.ACTION}
              label="Log in"
              onClick={onLogin}
            />
            <Button
              variant={Button.Variant.GHOST}
              inverted
              label="Sign in"
              onClick={onSignIn}
            />
          </div>
        )}
      </div>
    </div>
  );
};

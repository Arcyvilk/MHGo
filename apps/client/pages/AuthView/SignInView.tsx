import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Icon, Input, Size } from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';

import s from './AuthView.module.scss';

export const SignInView = () => {
  const navigate = useNavigate();
  const { isLoggedIn, signinUser, isSigninPending } = useMe();
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');

  const onSignIn = () => {
    signinUser({ userName, pwd, email: 'test@test.com' });
  };

  const onLogin = () => {
    navigate('/login');
  };

  if (isLoggedIn) return <Navigate to="/" replace={true} />;
  return (
    <div className={s.authView}>
      <div className={s.authView__wrapper}>
        <img
          className={s.authView__logo}
          src="https://cdn.arcyvilk.com/mhgo/misc/logo.png"
          alt="logo"
        />
        <div className={s.authView__title}>Create new account</div>
        <div className={s.authView__inputs}>
          <Input
            name="login_name"
            label="Username"
            value={userName}
            setValue={setUserName}
            onKeyDown={event => event.key === 'Enter' && onSignIn()}
            style={{ width: '275px', maxWidth: '100%' }}
          />
          <Input
            name="login_pwd"
            label="Password"
            value={pwd}
            setValue={setPwd}
            type="password"
            onKeyDown={event => event.key === 'Enter' && onSignIn()}
            style={{ width: '275px', maxWidth: '100%' }}
          />
        </div>
        {isSigninPending ? (
          <Icon icon="Spin" spin size={Size.BIG} />
        ) : (
          <div className={s.authView__inputs}>
            <Button
              variant={Button.Variant.ACTION}
              label="Sign in"
              onClick={onSignIn}
            />
            <Button
              variant={Button.Variant.GHOST}
              inverted
              label="Back to login"
              onClick={onLogin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

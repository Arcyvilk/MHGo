import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Button,
  Icon,
  Input,
  Size,
  logo,
  useNavigateWithScroll,
} from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';

import s from './AuthView.module.scss';

export const LoginView = () => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { isLoggedIn, loginUser, isLoginPending } = useMe();
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');

  const onLogin = () => {
    loginUser(userName, pwd);
  };

  const onSignIn = () => {
    navigateWithoutScroll('/auth/signin');
  };

  if (isLoggedIn) return <Navigate to="/" replace={true} />;
  return (
    <>
      <img className={s.authView__logo} src={logo} alt="logo" />
      <div className={s.authView__title}>Login</div>
      <div className={s.authView__inputs}>
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
        <div className={s.authView__inputs}>
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
    </>
  );
};

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Icon,
  Input,
  LSKeys,
  Size,
  useLocalStorage,
  useNavigateWithScroll,
} from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';

import s from './AuthView.module.scss';

export const SignInView = () => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { isLoggedIn, signinUser, isSigninPending } = useMe();
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdRepeat, setPwdRepeat] = useState('');
  // We want to clear the home position for the newly signed in user
  const [_, setHomePosition] = useLocalStorage<{
    home: number[];
  }>(LSKeys.MHGO_HOME_POSITION, {
    home: [0, 0],
  });

  const onSignIn = () => {
    if (pwd !== pwdRepeat) {
      toast.error('The password does not match!');
      return;
    }
    setHomePosition(null);
    signinUser({ userName, pwd, email: 'test@test.com' });
  };

  const onLogin = () => {
    navigateWithoutScroll('/auth/login');
  };

  if (isLoggedIn) return <Navigate to="/" replace={true} />;
  return (
    <>
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
          label="New password"
          value={pwd}
          setValue={setPwd}
          type="password"
          onKeyDown={event => event.key === 'Enter' && onSignIn()}
          style={{ width: '275px', maxWidth: '100%' }}
        />
        <Input
          name="login_pwd"
          label="Repeat password"
          value={pwdRepeat}
          setValue={setPwdRepeat}
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
    </>
  );
};

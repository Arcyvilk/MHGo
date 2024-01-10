import { useEffect, useState } from 'react';
import { Button, Icon, Input, Size } from '@mhgo/front';
import { useUser } from '../../hooks/useUser';

import s from './LoginView.module.scss';
import { useNavigate } from 'react-router-dom';

export const LoginView = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loginUser, isPending } = useUser();
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');

  const onLogin = () => {
    loginUser(userName, pwd);
  };

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn]);

  return (
    <div className={s.loginView}>
      <div className={s.loginView__wrapper}>
        <div className={s.loginView__title}>Login</div>
        <div className={s.loginView__inputs}>
          <Input
            name="login_name"
            label="Username"
            value={userName}
            setValue={setUserName}
            style={{ width: '250px', maxWidth: '100%' }}
          />
          <Input
            name="login_pwd"
            label="Password"
            value={pwd}
            setValue={setPwd}
            type="password"
            style={{ width: '250px', maxWidth: '100%' }}
          />
        </div>
        <Button
          variant={Button.Variant.ACTION}
          label={
            isPending ? <Icon icon="Spin" spin size={Size.TINY} /> : 'Log in'
          }
          onClick={onLogin}
        />
      </div>
    </div>
  );
};
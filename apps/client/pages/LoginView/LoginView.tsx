import { useNavigate } from 'react-router-dom';

import { addCdnUrl, Button, CloseButton, Icon } from '@mhgo/front';
import { Size } from '@mhgo/front';
import { usePaintballs } from '../../hooks/usePaintballs';
import { useUser } from '../../hooks/useUser';

import s from './LoginView.module.scss';

export const LoginView = () => {
  const { userId } = useUser();

  return (
    <div className={s.paintballView}>
      <div className={s.header}>
        <div className={s.header__title}>Login</div>
      </div>
      <CloseButton />
    </div>
  );
};

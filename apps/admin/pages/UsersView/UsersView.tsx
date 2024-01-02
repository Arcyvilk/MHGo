import { useNavigate } from 'react-router-dom';
import { Button } from '@mhgo/front';
import { ActionBar } from '../../containers';

import s from './UsersView.module.scss';

export const UsersView = () => {
  const navigate = useNavigate();
  return (
    <div className={s.usersView}>
      <div className={s.usersView__header}>
        <h1 className={s.usersView__title}>USERS</h1>
      </div>
      <ActionBar
        buttons={
          <>
            <Button label="Create new user" onClick={() => navigate('user')} />
          </>
        }
      />
      <div className={s.usersView__content}>TODO</div>
    </div>
  );
};

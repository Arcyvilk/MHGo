import { useNavigate } from 'react-router-dom';
import {
  Button,
  Icon,
  Size,
  useAdminAllUsersApi,
  useAdminUpdateUserApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit, Table } from '../../containers';

import s from './UsersView.module.scss';
import { User } from '@mhgo/types';
import { Switch } from '@mui/material';
import { CDN_URL } from '@mhgo/front/env';

const tableHeaders = [
  'Name',
  'ID',
  'Exp',
  'Is Admin?',
  'Is awaiting approval?',
  'Is approved?',
  'Is banned?',
  'Actions',
];
export const UsersView = () => {
  const navigate = useNavigate();
  const { data: users } = useAdminAllUsersApi();
  const { mutate, isSuccess, isError, isPending } = useAdminUpdateUserApi();

  const onUserCreate = () => {
    navigate('/users/create');
  };

  const onUserEdit = (user: User) => {
    navigate(`/users/edit?id=${user.id}`);
  };

  const tableRows = users.map(user => [
    <ItemCell user={user} />,
    user.id,
    user.exp,
    <Switch
      color="default"
      checked={user.isAdmin}
      onChange={(_, checked) =>
        mutate({ userId: user.id, userAuth: { isAdmin: checked } })
      }
    />,
    <Switch
      color="default"
      checked={user.isAwaitingModApproval}
      onChange={(_, checked) =>
        mutate({
          userId: user.id,
          userAuth: { isAwaitingModApproval: checked },
        })
      }
    />,
    <Switch
      color="default"
      checked={user.isModApproved}
      onChange={(_, checked) =>
        mutate({ userId: user.id, userAuth: { isModApproved: checked } })
      }
    />,
    <Switch
      color="default"
      checked={user.isBanned}
      onChange={(_, checked) =>
        mutate({ userId: user.id, userBan: { isBanned: checked } })
      }
    />,
    <Button
      label={<Icon icon="Edit" size={Size.MICRO} />}
      onClick={() => {
        onUserEdit(user);
      }}
      style={{ width: '40px' }}
    />,
  ]);

  return (
    <div className={s.usersView}>
      <HeaderEdit status={{ isPending, isError, isSuccess }} title="USERS" />
      <ActionBar
        buttons={<Button label="Create new user" onClick={onUserCreate} />}
      />
      <div className={s.usersView__content}>
        <Table tableHeaders={tableHeaders} items={tableRows} />
      </div>
    </div>
  );
};

const ItemCell = ({ user }: { user: User }) => {
  return (
    <div className={s.usersView__itemDetail}>
      <img
        src={`${CDN_URL}/${user.avatar}`}
        className={s.usersView__itemIcon}
      />{' '}
      {user.name}
    </div>
  );
};

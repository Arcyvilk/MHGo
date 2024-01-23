import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AdminUser, Order, User } from '@mhgo/types';
import { Switch } from '@mui/material';
import { CDN_URL } from '@mhgo/front/env';
import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useAdminAllUsersApi,
  useAdminDeleteUserApi,
  useAdminUpdateUserApi,
} from '@mhgo/front';
import { ActionBar, HeaderEdit, Table, TableHeader } from '../../containers';

import s from './UsersView.module.scss';

const tableHeaders: TableHeader<AdminUser>[] = [
  { id: 'name', label: 'Name' },
  { id: 'id', label: 'ID' },
  { id: 'exp', label: 'Exp' },
  { id: 'isAdmin', label: 'Admin' },
  { id: 'isAwaitingModApproval', label: 'Awaiting approval' },
  { id: 'isModApproved', label: 'Approved' },
  { id: 'isBanned', label: 'Banned' },
  { id: 'actions', label: 'Actions' },
];
export const UsersView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const { data: users } = useAdminAllUsersApi();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof AdminUser>('name');

  const {
    mutate: mutateUpdate,
    isSuccess,
    isError,
    isPending,
  } = useAdminUpdateUserApi();
  const {
    mutate: mutateDelete,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useAdminDeleteUserApi();

  useEffect(() => {
    if (isDeleteError === true) toast.error('Could not delete user!');
    if (isDeleteSuccess === true) toast.success('User deleted successfully!');
  }, [isDeleteSuccess, isDeleteError]);

  const onUserCreate = () => {
    navigate('/users/create');
  };

  const onUserEdit = (user: User) => {
    navigate(`/users/edit?id=${user.id}`);
  };
  const onUserDelete = (user: User) => {
    const shouldDeleteUser = confirm(
      `Are you REALLY sure you want to delete user ${user.name}? THIS CANNOT BE UNDONE! `,
    );
    if (shouldDeleteUser) mutateDelete(user.id);
  };

  const sortedUsers = useMemo(() => {
    if (order && orderBy)
      return users.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return users;
  }, [users, order, orderBy]);

  const tableRows = sortedUsers.map(user => [
    <ItemCell user={user} />,
    <Table.CustomCell content={user.id} />,
    user.exp,
    <Switch
      color="default"
      checked={user.isAdmin}
      onChange={(_, checked) =>
        mutateUpdate({ userId: user.id, userAuth: { isAdmin: checked } })
      }
    />,
    <Switch
      color="default"
      checked={user.isAwaitingModApproval}
      onChange={(_, checked) =>
        mutateUpdate({
          userId: user.id,
          userAuth: { isAwaitingModApproval: checked },
        })
      }
    />,
    <Switch
      color="default"
      checked={user.isModApproved}
      onChange={(_, checked) =>
        mutateUpdate({ userId: user.id, userAuth: { isModApproved: checked } })
      }
    />,
    <Switch
      color="default"
      checked={user.isBanned}
      onChange={(_, checked) =>
        mutateUpdate({ userId: user.id, userBan: { isBanned: checked } })
      }
    />,
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button
        label={<Icon icon="Edit" size={Size.MICRO} />}
        onClick={() => {
          onUserEdit(user);
        }}
        style={{ width: '40px' }}
      />
      <Button
        label={<Icon icon="Trash" size={Size.MICRO} />}
        onClick={() => {
          onUserDelete(user);
        }}
        variant={Button.Variant.DANGER}
        style={{ width: '40px' }}
      />
    </div>,
  ]);

  return (
    <div className={s.usersView}>
      <HeaderEdit status={{ isPending, isError, isSuccess }} title="USERS" />
      <ActionBar
        buttons={<Button label="Create new user" onClick={onUserCreate} />}
      />
      <div className={s.usersView__content}>
        <Table
          tableHeaders={tableHeaders}
          items={tableRows}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
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

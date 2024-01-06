import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Input,
  useAdminAllUsersApi,
  useAdminResetUserApi,
  useAdminUpdateUserApi,
} from '@mhgo/front';
import { Status } from '../../../utils/types';
import { ActionBar, HeaderEdit } from '../../../containers';

import s from './SingleUserView.module.scss';

export const UserEditView = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });
  const { updatedUser, setUpdatedUser, onSave, onReset } =
    useUpdateResource(setStatus);

  const onResetClick = () => {
    const shouldReset = confirm(
      'Do you REALLY want to reset this user? It will delete all of their items, materials and quest progress, as well as zero their experience!',
    );
    if (shouldReset) onReset();
  };

  if (!updatedUser)
    return (
      <div className={s.singleResourceView}>
        <div className={s.singleResourceView__header}>
          <h1 className={s.singleResourceView__title}>
            This user does not exist!
          </h1>
        </div>
        <div className={s.singleResourceView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleResourceView}>
      <HeaderEdit status={status} title="Edit user" />
      <ActionBar
        title={`User ID: ${updatedUser?.id}`}
        buttons={
          <>
            <Button
              label="Cancel"
              inverted
              simple
              onClick={() => navigate(-1)}
              variant={Button.Variant.GHOST}
            />
            <Button
              label="Reset"
              onClick={onResetClick}
              variant={Button.Variant.DANGER}
            />
            <Button
              label="Save"
              onClick={onSave}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.singleResourceView__content}>
        <div className={s.singleResourceView__section}>
          <Input
            name="user_name"
            label="User's name"
            value={updatedUser?.name ?? ''}
            setValue={name =>
              updatedUser && setUpdatedUser({ ...updatedUser, name })
            }
          />
        </div>
      </div>
    </div>
  );
};

const useUpdateResource = (setStatus: (status: Status) => void) => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: users, isFetched: isUsersFetched } = useAdminAllUsersApi();

  const user = useMemo(
    () => users.find(i => i.id === id),
    [users, isUsersFetched],
  );
  const [updatedUser, setUpdatedUser] = useState(user);

  useEffect(() => {
    setUpdatedUser(user);
  }, [isUsersFetched]);

  const { mutateUpdateUser, mutateResetUser } = useStatus(setStatus);

  const onSave = () => {
    if (updatedUser)
      mutateUpdateUser({ userId: updatedUser.id, user: updatedUser });
  };

  const onReset = () => {
    if (user?.id) mutateResetUser(user.id);
  };

  return {
    updatedUser,
    setUpdatedUser,
    onSave,
    onReset,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const {
    mutate: mutateUpdateUser,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    isPending: isPendingUpdate,
  } = useAdminUpdateUserApi();

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      isPending: isPendingUpdate,
    });
  }, [isSuccessUpdate, isErrorUpdate, isPendingUpdate]);

  const {
    mutate: mutateResetUser,
    isSuccess: isSuccessReset,
    isError: isErrorReset,
    isPending: isPendingReset,
  } = useAdminResetUserApi();

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessReset,
      isError: isErrorReset,
      isPending: isPendingReset,
    });
  }, [isSuccessReset, isErrorReset, isPendingReset]);

  return { mutateUpdateUser, mutateResetUser };
};

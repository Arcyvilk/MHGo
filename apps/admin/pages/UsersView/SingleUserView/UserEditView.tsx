import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Input,
  Switch,
  modifiers,
  useAdminAllUsersApi,
  useAdminResetUserApi,
  useAdminUpdateUserApi,
  useAdminUserGodmodeApi,
} from '@mhgo/front';
import { UserResetType } from '@mhgo/types';
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
  const {
    updatedUser,
    setUpdatedUser,
    toReset,
    setToReset,
    onGodmodeEnable,
    onSave,
    onReset,
  } = useUpdateUser(setStatus);

  const onResetClick = () => {
    const shouldReset = confirm(
      'Do you REALLY want to reset this user? THIS CANNOT BE UNDONE.',
    );
    if (shouldReset) onReset();
  };

  if (!updatedUser)
    return (
      <div className={s.singleUserView}>
        <div className={s.singleUserView__header}>
          <h1 className={s.singleUserView__title}>This user does not exist!</h1>
        </div>
        <div className={s.singleUserView__footer}>
          <Button label="Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );

  return (
    <div className={s.singleUserView}>
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
              label="Save"
              onClick={onSave}
              variant={Button.Variant.ACTION}
            />
          </>
        }
      />
      <div className={s.singleUserView__content}>
        <div className={s.singleUserView__section}>
          <Input
            name="user_name"
            label="User's name"
            value={updatedUser?.name ?? ''}
            setValue={name =>
              updatedUser && setUpdatedUser({ ...updatedUser, name })
            }
          />
          <Input
            name="user_exp"
            label="User's experience"
            value={String(updatedUser?.exp ?? 0)}
            setValue={exp =>
              updatedUser &&
              setUpdatedUser({ ...updatedUser, exp: Number(exp) })
            }
          />
          <Input
            name="user_wounds"
            label="User's wounds"
            value={String(updatedUser?.wounds ?? 0)}
            setValue={wounds =>
              updatedUser &&
              setUpdatedUser({ ...updatedUser, wounds: Number(wounds) })
            }
          />
          <Button
            label="Enable godmode"
            onClick={onGodmodeEnable}
            variant={Button.Variant.ACTION}
          />
        </div>
        <div
          className={modifiers(s, 'singleUserView__section', { hidden: true })}>
          <div className={s.singleUserView__grid}>
            {Object.keys(toReset).map(key => (
              <Switch
                key={`reset-${key}`}
                label={key.toUpperCase()}
                checked={toReset[key as keyof UserResetType] ?? false}
                setChecked={checked =>
                  toReset &&
                  setToReset({
                    ...toReset,
                    [key]: checked,
                  })
                }
              />
            ))}
          </div>
          <Button
            label="Reset"
            onClick={onResetClick}
            variant={Button.Variant.DANGER}
          />
        </div>
      </div>
    </div>
  );
};

const useUpdateUser = (setStatus: (status: Status) => void) => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { data: users, isFetched: isUsersFetched } = useAdminAllUsersApi();

  const user = useMemo(
    () => users.find(i => i.id === id),
    [users, isUsersFetched],
  );
  const [updatedUser, setUpdatedUser] = useState(user);
  const [toReset, setToReset] = useState<UserResetType>({
    achievements: false,
    basic: false,
    cooldowns: false,
    items: false,
    loadout: false,
    materials: false,
    wealth: false,
  });

  useEffect(() => {
    setUpdatedUser(user);
  }, [isUsersFetched]);

  const { mutateUpdateUser, mutateResetUser, mutateGodmode } =
    useStatus(setStatus);

  const onSave = () => {
    if (updatedUser)
      mutateUpdateUser({ userId: updatedUser.id, user: updatedUser });
  };

  const onReset = () => {
    if (user?.id) mutateResetUser({ userId: user.id, toReset });
  };

  const onGodmodeEnable = () => {
    if (user?.id) mutateGodmode(user.id);
  };

  return {
    updatedUser,
    setUpdatedUser,
    toReset,
    setToReset,
    onSave,
    onReset,
    onGodmodeEnable,
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

  const {
    mutate: mutateGodmode,
    isSuccess: isSuccessGodmode,
    isError: isErrorGodmode,
    isPending: isPendingGodmode,
  } = useAdminUserGodmodeApi();

  useEffect(() => {
    setStatus({
      isSuccess: isSuccessGodmode,
      isError: isErrorGodmode,
      isPending: isPendingGodmode,
    });
  }, [isSuccessGodmode, isErrorGodmode, isPendingGodmode]);

  return { mutateUpdateUser, mutateResetUser, mutateGodmode };
};

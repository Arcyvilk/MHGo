import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Loader,
  QueryBoundary,
  useAllSettingsApi,
  useAdminUpdateSettingsApi,
} from '@mhgo/front';

import { Status } from '../../utils/types';
import { ActionBar, HeaderEdit } from '../../containers';

import s from './SettingsView.module.scss';
import { Settings } from '@mhgo/types';

export const SettingsView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    isSuccess: false,
    isError: false,
    isPending: false,
  });

  const { updatedSettings, setUpdatedSettings, onSave } =
    useUpdateSettings(setStatus);

  return (
    <div className={s.settingsView}>
      <HeaderEdit status={status} title="Settings" />
      <ActionBar
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
      <div className={s.settingsView__content}>
        {updatedSettings.map(setting => (
          <div key={setting.key}>
            <Input
              name={setting.key}
              label={setting.key}
              value={setting.value as any}
              onChange={event => {
                const updatedEntries = updatedSettings.map(entry => {
                  if (entry.key === setting.key) {
                    const newValue = event.target.value;
                    return {
                      ...entry,
                      value:
                        typeof setting.value === 'number'
                          ? Number(newValue)
                          : newValue,
                    };
                  }
                  return entry;
                });
                return setUpdatedSettings(updatedEntries);
              }}
              type={typeof setting.value === 'number' ? 'number' : 'text'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const useUpdateSettings = (setStatus: (status: Status) => void) => {
  const { data: settings, isFetched: isSettingsFetched } = useAllSettingsApi();
  const [updatedSettings, setUpdatedSettings] =
    useState<Settings<unknown>>(settings);

  useEffect(() => {
    const filteredSettings = settings.filter(
      setting => typeof setting.value !== 'object',
    );
    setUpdatedSettings(filteredSettings);
  }, [isSettingsFetched]);

  const { mutateSetting } = useStatus(setStatus);

  const onSave = () => {
    if (updatedSettings) mutateSetting(updatedSettings);
  };

  return {
    updatedSettings,
    setUpdatedSettings,
    onSave,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const {
    mutate: mutateSetting,
    isSuccess,
    isError,
    isPending,
  } = useAdminUpdateSettingsApi();

  useEffect(() => {
    setStatus({
      isSuccess,
      isError,
      isPending,
    });
  }, [isSuccess, isError, isPending]);

  return { mutateSetting };
};

const useAdminUpdateSetting = () => {
  return {
    mutate: (update: any) => console.log(update),
    isSuccess: false,
    isError: false,
    isPending: false,
  };
};

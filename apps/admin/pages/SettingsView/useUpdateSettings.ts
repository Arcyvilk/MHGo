import { useEffect, useState } from 'react';

import { Settings } from '@mhgo/types';
import { useAllSettingsApi, useAdminUpdateSettingsApi } from '@mhgo/front';

import { Status } from '../../utils/types';

export const useUpdateSettings = (setStatus: (status: Status) => void) => {
  const { data: settings, isFetched: isSettingsFetched } = useAllSettingsApi();
  const [updatedSimpleSettings, setUpdatedSimpleSettings] = useState<
    Settings<string | number>
  >([]);

  useEffect(() => {
    const filteredSettings = settings.filter(
      setting => typeof setting.value !== 'object',
    ) as Settings<string | number>;
    setUpdatedSimpleSettings(filteredSettings);
  }, [isSettingsFetched]);

  const { mutateSetting } = useStatus(setStatus);

  const onSave = () => {
    if (updatedSimpleSettings) mutateSetting(updatedSimpleSettings);
  };

  return {
    updatedSimpleSettings,
    setUpdatedSimpleSettings,
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

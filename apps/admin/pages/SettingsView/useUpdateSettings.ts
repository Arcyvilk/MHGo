import { useEffect, useState } from 'react';

import { Settings } from '@mhgo/types';
import { useAllSettingsApi, useAdminUpdateSettingsApi } from '@mhgo/front';

import { Status } from '../../utils/types';

export const useUpdateSettings = (setStatus: (status: Status) => void) => {
  const { data: settings, isFetched: isSettingsFetched } = useAllSettingsApi();
  const [updatedSimpleSettings, setUpdatedSimpleSettings] = useState<
    Settings<string | number>
  >([]);
  const [updatedComplexSettings, setUpdatedComplexSettings] = useState<
    Settings<object>
  >([]);

  useEffect(() => {
    const filteredSettingsSimple = settings.filter(
      setting => typeof setting.value !== 'object',
    ) as Settings<string | number>;
    const filteredSettingsComplex = settings.filter(
      setting => typeof setting.value === 'object',
    ) as Settings<object>;
    setUpdatedSimpleSettings(filteredSettingsSimple);
    setUpdatedComplexSettings(filteredSettingsComplex);
  }, [isSettingsFetched]);

  const { mutateSettings } = useStatus(setStatus);

  const onSave = () => {
    if (updatedSimpleSettings) mutateSettings(updatedSimpleSettings);
    if (updatedComplexSettings) mutateSettings(updatedComplexSettings);
  };

  return {
    updatedSimpleSettings,
    setUpdatedSimpleSettings,
    updatedComplexSettings,
    setUpdatedComplexSettings,
    onSave,
  };
};

const useStatus = (setStatus: (status: Status) => void) => {
  const {
    mutate: mutateSettings,
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

  return { mutateSettings };
};

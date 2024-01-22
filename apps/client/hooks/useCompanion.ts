import { useCompanionApi, useSettingsApi } from '@mhgo/front';

export const useCompanion = () => {
  const { setting = '' } = useSettingsApi<string>('default_companion', '');
  const { data: companion } = useCompanionApi(setting);

  return { companion };
};

import { useEffect, useState } from 'react';
import { Input, useAllSettingsApi } from '@mhgo/front';
import s from './SettingsView.module.scss';

export const SettingsView = () => {
  const { data: settings } = useAllSettingsApi();
  const [updatedSettings, setUpdatedSettings] = useState(settings);

  const onValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    const update = updatedSettings.map(setting => {
      if (setting.key === key)
        return {
          ...setting,
          value: event.target.value,
        };
      else return setting;
    });
    setUpdatedSettings(update);
  };

  useEffect(() => {
    const filteredSettings = settings.filter(
      setting => typeof setting.value !== 'object',
    );
    setUpdatedSettings(filteredSettings);
  }, []);

  return (
    <div className={s.settingsView}>
      <div className={s.settingsView__header}>
        <h1 className={s.settingsView__title}>SETTINGS</h1>
      </div>
      <div className={s.settingsView__content}>
        {updatedSettings.map(setting => (
          <div>
            <Input
              name={setting.key}
              label={setting.key}
              value={setting.value}
              onChange={event => onValueChange(event, setting.key)}
              type={
                typeof Number(setting.value) === 'number' ? 'number' : 'text'
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

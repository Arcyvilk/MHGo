import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Loader, QueryBoundary } from '@mhgo/front';
import { Settings } from '@mhgo/types';

import { ActionBar, HeaderEdit } from '../../containers';
import { useUpdateSettings } from './useUpdateSettings';

import s from './SettingsView.module.scss';

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

  const { updatedSimpleSettings, setUpdatedSimpleSettings, onSave } =
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
      <SettingsSimple
        updatedSettings={updatedSimpleSettings}
        setUpdatedSettings={setUpdatedSimpleSettings}
      />
    </div>
  );
};

type SettingsSimpleProps = {
  updatedSettings: Settings<string | number>;
  setUpdatedSettings: (updatedSettings: Settings<string | number>) => void;
};
const SettingsSimple = ({
  updatedSettings,
  setUpdatedSettings,
}: SettingsSimpleProps) => {
  return (
    <div className={s.settingsView__content}>
      {updatedSettings.map(setting => {
        const { key, value } = setting;
        return (
          <div key={key}>
            <Input
              name={key}
              label={key}
              value={typeof value === 'number' ? String(value) : value}
              onChange={event => {
                const updatedEntries = updatedSettings.map(entry => {
                  if (entry.key === key) {
                    const newValue = event.target.value;
                    return {
                      ...entry,
                      value:
                        typeof value === 'number' ? Number(newValue) : newValue,
                    };
                  }
                  return entry;
                });
                return setUpdatedSettings(updatedEntries);
              }}
              type={typeof setting.value === 'number' ? 'number' : 'text'}
            />
          </div>
        );
      })}
    </div>
  );
};

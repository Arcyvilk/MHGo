import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JSONInput from 'react-json-editor-ajrm';
// @ts-ignore
import locale from 'react-json-editor-ajrm/locale/en';

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

  const {
    updatedSimpleSettings,
    setUpdatedSimpleSettings,
    updatedComplexSettings,
    setUpdatedComplexSettings,
    onSave,
  } = useUpdateSettings(setStatus);

  return (
    <div className={s.settingsView}>
      <HeaderEdit status={status} title="Settings" hasBackButton={false} />
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
      <SettingsComplex
        updatedSettings={updatedComplexSettings}
        setUpdatedSettings={setUpdatedComplexSettings}
      />
    </div>
  );
};

type SettingsProps<T> = {
  updatedSettings: Settings<T>;
  setUpdatedSettings: (updatedSettings: Settings<T>) => void;
};
const SettingsSimple = ({
  updatedSettings,
  setUpdatedSettings,
}: SettingsProps<string | number>) => {
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

type Change = {
  error: boolean;
  jsObject: Record<string, unknown>;
};
const SettingsComplex = ({
  updatedSettings,
  setUpdatedSettings,
}: SettingsProps<object>) => {
  const onSettingChange = (change: Change, key: string) => {
    const updatedEntries = updatedSettings.map(entry => {
      if (entry.key === key) {
        return {
          ...entry,
          value: change.jsObject,
        };
      }
      return entry;
    });
    return setUpdatedSettings(updatedEntries);
  };

  return (
    <div className={s.settingsView__content}>
      {updatedSettings.map(setting => {
        const { key, value } = setting;
        return (
          <div className={s.complexSetting}>
            <div className={s.complexSetting__name}>{key}</div>
            <JSONInput
              id="a_unique_id"
              placeholder={value}
              locale={locale}
              height="200px"
              confirmGood={false}
              onChange={(change: Change) => onSettingChange(change, key)}
            />
          </div>
        );
      })}
    </div>
  );
};

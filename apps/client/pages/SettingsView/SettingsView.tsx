import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button, CloseButton, Slider } from '../../components';
import { Volume, useVolume } from '../../hooks/useVolume';
import { STATUS, useLogin } from '../../hooks/useLogin';
import { APP_NAME, APP_VERSION } from '../../utils/consts';

import s from './SettingsView.module.scss';
import { addCdnUrl } from '../../utils/addCdnUrl';

const DEFAULT = {
  min: 0,
  max: 100,
};

export const SettingsView = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { volume, setVolume } = useVolume();
  const { onLogOut, onDeleteAccount } = useLogin();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      setInstallPrompt(event);
    });
  }, []);

  const onLogOutClick = async () => {
    const logOutStatus = await onLogOut();
    if (logOutStatus === STATUS.ERROR) toast.error('Did not work :C');
    if (logOutStatus === STATUS.SUCCESS) toast.success('Did work :3');
  };

  const onDeleteAccountClick = async () => {
    const deleteStatus = await onDeleteAccount();
    if (deleteStatus === STATUS.ERROR) toast.error('Did not work :C');
    if (deleteStatus === STATUS.SUCCESS) toast.success('Did work :3');
  };

  const onInstallClick = async () => {
    if (!installPrompt) return;
    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    setInstallPrompt(null);
  };

  return (
    <div className={s.settingsView}>
      <div className={s.header}>
        <div className={s.header__title}>Settings</div>
      </div>
      <div className={s.settingsView__wrapper}>
        <div className={s.section}>
          <SettingsSlider
            title="Master Volume"
            id="master"
            volume={volume}
            setVolume={setVolume}
          />
          <SettingsSlider
            title="BGM Volume"
            id="bgm"
            volume={volume}
            setVolume={setVolume}
          />
          <SettingsSlider
            title="SE Volume"
            id="se"
            volume={volume}
            setVolume={setVolume}
          />
        </div>

        <div className={s.section}>
          <Button label="Log out" onClick={onLogOutClick} />
          <Button
            label="Delete account"
            onClick={onDeleteAccountClick}
            variant={Button.Variant.DANGER}
          />
          <p className={s.disclaimer}>
            Once your {APP_NAME} account is deleted, it will no longer be
            accessible by you or anyone else. This action cannot be undone.
          </p>
        </div>

        {installPrompt && (
          <div className={s.section}>
            <Button label="Install this app" onClick={onInstallClick} />
          </div>
        )}

        <div className={s.section}>
          <img src={addCdnUrl('/misc/logo.png')} />
          <p className={s.version}>
            Arcyvilk 2023-2024 (c) ALL RIGHTS RESERVED. {APP_NAME} is a
            protected trademark.
          </p>
          <p className={s.version}>{APP_VERSION}</p>
        </div>
      </div>
      <CloseButton />
    </div>
  );
};

type SliderProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title: string;
  id: Volume;
  volume: Record<Volume, number>;
  setVolume: (volume: Record<Volume, number>) => void;
};
const SettingsSlider = ({
  title,
  id,
  volume,
  setVolume,
  ...props
}: SliderProps) => {
  const currentVolume = volume[id];

  const onVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = event.target.value;
    setVolume({
      ...volume,
      [id]: newVolume,
    });
  };

  return (
    <div className={s.slider}>
      <span className={s.slider__label}>{title}</span>
      <div className={s.slider__wrapper}>
        <Slider
          {...props}
          value={currentVolume}
          onChange={onVolumeChange}
          {...DEFAULT}
        />
      </div>
    </div>
  );
};

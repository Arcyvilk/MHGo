import s from './SettingsView.module.scss';

export const SettingsView = () => {
  return (
    <div className={s.settingsView}>
      <div className={s.settingsView__header}>
        <h1 className={s.settingsView__title}>SETTINGS</h1>
      </div>
      <div className={s.settingsView__content}></div>
    </div>
  );
};

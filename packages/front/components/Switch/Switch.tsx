import s from './Switch.module.scss';

type SwitchProps = {
  label?: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
};
export const Switch = ({ label, checked, setChecked }: SwitchProps) => {
  return (
    <div className={s.switch}>
      {label && <h2 className={s.switch__label}>{label}</h2>}
      <label className={s.switch__wrapper}>
        <input
          type="checkbox"
          checked={checked}
          onChange={event => {
            setChecked(event.target.checked);
          }}
        />
        <span className={s.switch__slider} />
      </label>
    </div>
  );
};

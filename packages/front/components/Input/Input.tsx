import s from './Input.module.scss';

type InputProps = {
  name: string;
  label?: React.ReactNode;
  value: string;
  setValue?: (value: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;
export const Input = ({
  name,
  label,
  value,
  setValue,
  ...inputProps
}: InputProps) => {
  const onSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) setValue(event.target.value);
  };

  return (
    <div className={s.input__wrapper}>
      {label && (
        <label htmlFor={name} className={s.input__label}>
          {label}
        </label>
      )}
      <input
        type="text"
        className={s.input}
        id={name}
        value={value}
        onChange={onSelect}
        {...inputProps}
      />
    </div>
  );
};

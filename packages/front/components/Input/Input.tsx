import s from './Input.module.scss';

type InputProps = { name: string; label?:string; value: string; setValue: (value: string) => void };
export const Input = ({
  name,
  label,
  value,
  setValue,
}: InputProps) => {
  const onSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
  };

  return (
    <div className={s.input__wrapper}>
      {label && <label htmlFor={name}>{label}</label>}
      <input type="text" className={s.input} id={name} value={value} onChange={onSelect} />
    </div>
  );
}

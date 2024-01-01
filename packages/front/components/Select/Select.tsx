import s from './Select.module.scss';

type SelectProps<T> = {
  data: T[];
  name: string;
  defaultSelected?: string;
  label?: string;
  setValue: (value: string) => void;
};
export function Select<T extends { id: string; name: string }>({
  data,
  name,
  defaultSelected,
  label,
  setValue,
}: SelectProps<T>) {
  const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setValue(value);
  };

  return (
    <div className={s.select__wrapper}>
      {label && (
        <label htmlFor={name} style={{ fontWeight: 600 }}>
          {label}
        </label>
      )}
      <select
        className={s.select}
        name={name}
        id={name}
        onChange={onSelect}
        defaultValue={defaultSelected}>
        {data.map(item => (
          <option className={s.select__option} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

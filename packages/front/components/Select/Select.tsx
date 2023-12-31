import s from './Select.module.scss';

type SelectProps<T> = { data: T[]; name: string; setValue: (value: string) => void };
export function Select<T extends { id: string; name: string }>({
  data,
  name,
  setValue,
}: SelectProps<T>) {
  const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setValue(value);
  };

  return (
    <div className={s.select__wrapper}>
      <label htmlFor={name}>Choose something:</label>
      <select className={s.select} name={name} id={name} onChange={onSelect}>
        {data.map(item => (
          <option value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
}

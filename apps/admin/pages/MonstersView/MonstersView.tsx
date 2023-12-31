import { useState } from 'react';
import { useMonstersApi } from '@mhgo/front';

import s from './MonstersView.module.scss';

export const MonstersView = () => {
  const [selectedMonster, setSelectedMonster] = useState<string>();
  const { data: monsters } = useMonstersApi();

  return (
    <div className={s.monstersView}>
      <h2 className={s.monstersView__title}>Monsters</h2>
      <Select data={monsters} setValue={setSelectedMonster} />
      <h2 className={s.monstersView__title}>Editing: {selectedMonster}</h2>
    </div>
  );
};

type SelectProps<T> = { data: T[]; setValue: (value: string) => void };
function Select<T extends { id: string; name: string }>({
  data,
  setValue,
}: SelectProps<T>) {
  const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monsterId = event.target.value;
    setValue(monsterId);
  };

  return (
    <>
      <label htmlFor="monsters">Choose a monster:</label>
      <select name="monsters" id="monsters" onChange={onSelect}>
        {data.map(item => (
          <option value={item.id}>{item.name}</option>
        ))}
      </select>
    </>
  );
}

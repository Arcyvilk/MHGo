import { useState } from 'react';
import { Select, useMonstersApi } from '@mhgo/front';

import s from './MonstersView.module.scss';

export const MonstersView = () => {
  const [selectedMonster, setSelectedMonster] = useState<string>();
  const { data: monsters } = useMonstersApi();

  return (
    <div className={s.monstersView}>
      <h2 className={s.monstersView__title}>Monsters</h2>
      <Select data={monsters} name="monsters" setValue={setSelectedMonster} />
      <h2 className={s.monstersView__title}>Editing: {selectedMonster}</h2>
    </div>
  );
};

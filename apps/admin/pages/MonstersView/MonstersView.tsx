import { useState } from 'react';
import { Select, useMonstersApi } from '@mhgo/front';

import s from './MonstersView.module.scss';

export const MonstersView = () => {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>();
  const { data: monsters } = useMonstersApi();

  return (
    <div className={s.monstersView}>
      <div className={s.monstersView__header}>
        <h1 className={s.monstersView__title}>MONSTERS</h1>
      </div>
      <div className={s.monstersView__content}>
        <Select
          data={monsters}
          name="monsters"
          setValue={setSelectedMonsterId}
        />
        <h2 className={s.monstersView__title}>Editing: {selectedMonsterId}</h2>
      </div>
    </div>
  );
};

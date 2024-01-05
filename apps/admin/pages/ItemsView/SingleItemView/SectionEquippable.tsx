import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FormControlLabel, Switch } from '@mui/material';
import { ItemSlot, Stats, Item as TItem } from '@mhgo/types';
import { Input, Select, modifiers, useSettingsApi } from '@mhgo/front';

import { DEFAULT_SLOTS, DEFAULT_STATS } from '../../../utils/defaults';
import s from './SingleItemView.module.scss';

type EquippableProps = {
  updatedItem?: TItem;
  setUpdatedItem: (updatedItem: TItem) => void;
  updatedItemStats: Stats;
  setUpdatedItemStats: (updatedItemStats: Stats) => void;
};
export const SectionEquippable = ({
  updatedItem,
  setUpdatedItem,
  updatedItemStats,
  setUpdatedItemStats,
}: EquippableProps) => {
  const [selectedSlot, setSelectedSlot] = useState(
    updatedItem?.slot as ItemSlot,
  );
  const { setting: baseStats } = useSettingsApi('base_stats', DEFAULT_STATS);
  const { setting: equipmentSlots } = useSettingsApi(
    'equipment_slots',
    DEFAULT_SLOTS,
  );

  const slotOptions = (equipmentSlots as ItemSlot[]).map(slot => ({
    id: slot,
    name: slot.toUpperCase(),
  }));

  const stats = Object.keys(baseStats!);

  return (
    <div className={s.singleItemView__section}>
      <FormControlLabel
        label="Equippable?"
        control={
          <Switch
            color="default"
            checked={updatedItem?.equippable}
            onChange={(_, checked) =>
              updatedItem &&
              setUpdatedItem({
                ...updatedItem,
                equippable: checked,
              })
            }
          />
        }
      />
      {updatedItem?.equippable ? (
        <div
          className={modifiers(s, 'singleItemView__section', {
            hidden: true,
          })}>
          <Select
            defaultSelected={selectedSlot}
            data={slotOptions}
            key={uuid()}
            name="Equipment slot"
            setValue={slot => setSelectedSlot(slot as ItemSlot)}
          />
          {stats.map(stat => {
            const oldStat = updatedItemStats[stat as keyof Stats];
            return (
              <div className={s.singleItemView__stat}>
                <span className={s.singleItemView__statKey}>{stat}</span>
                <Input
                  key={stat}
                  name="equipment_stat"
                  type={typeof oldStat === 'number' ? 'number' : 'text'}
                  value={String(oldStat)}
                  style={{ maxWidth: '100px' }}
                  // TODO Implement elements
                  disabled={stat === 'element'}
                  setValue={newStat => {
                    const updatedEntries = {
                      ...updatedItemStats,
                      [stat]: stat === 'element' ? stat : Number(newStat),
                    };
                    return setUpdatedItemStats(updatedEntries);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

import { v4 as uuid } from 'uuid';
import { FormControlLabel, Switch } from '@mui/material';
import { ItemEffect, ItemSlot, Stats, Item as TItem } from '@mhgo/types';
import { Input, Select, modifiers, useSettingsApi } from '@mhgo/front';

import {
  DEFAULT_SLOTS,
  DEFAULT_STATS,
  DEFAULT_SPECIAL_EFFECT_TYPES,
} from '../../../utils/defaults';
import s from './SingleItemView.module.scss';

type EquippableProps = {
  item?: TItem;
  setItem: (Item: TItem) => void;
  itemStats: Stats;
  setItemStats: (itemStats: Stats) => void;
};
export const SectionEquippable = ({
  item,
  setItem,
  itemStats,
  setItemStats,
}: EquippableProps) => {
  const { setting: baseStats } = useSettingsApi('base_stats', DEFAULT_STATS);
  const { setting: equipmentSlots } = useSettingsApi(
    'equipment_slots',
    DEFAULT_SLOTS,
  );
  const { setting: specialEffects = [] } = useSettingsApi(
    'special_effect_types',
    DEFAULT_SPECIAL_EFFECT_TYPES,
  );

  const slotOptions = (equipmentSlots as ItemSlot[]).map(slot => ({
    id: slot,
    name: slot.toUpperCase(),
  }));

  const specialEffectOptions = (
    ['none', ...specialEffects] as (ItemEffect & 'none')[]
  ).map((effect: string) => ({
    id: effect,
    name: effect.toUpperCase(),
  }));

  const stats = Object.keys(baseStats!);

  return (
    <div className={s.singleItemView__section}>
      <FormControlLabel
        label="Equippable?"
        control={
          <Switch
            color="default"
            checked={item?.equippable}
            onChange={(_, checked) =>
              item &&
              setItem({
                ...item,
                equippable: checked,
              })
            }
          />
        }
      />
      {item?.equippable ? (
        <div
          className={modifiers(s, 'singleItemView__section', {
            hidden: true,
          })}>
          <div style={{ fontWeight: 600 }}>
            For the item to appear as equippable, it must have "armor" or
            "weapon" type.
          </div>
          <Select
            defaultSelected={item?.slot as ItemSlot}
            data={slotOptions}
            key={uuid()}
            name="Equipment slot"
            setValue={slot =>
              item && setItem({ ...item, slot: slot as ItemSlot })
            }
          />
          {stats.map(stat => {
            const oldStat = itemStats[stat as keyof Stats];
            return (
              <div className={s.singleItemView__stat}>
                <span className={s.singleItemView__statKey}>{stat}</span>
                {stat === 'specialEffects' ? (
                  <Select
                    defaultSelected={
                      Object.values(oldStat ?? {})?.[0] as ItemEffect
                    }
                    data={specialEffectOptions}
                    key={uuid()}
                    name="equipment_stat"
                    setValue={specialEffect => {
                      const updatedEntries = {
                        ...itemStats,
                        [stat]: [specialEffect] as ItemEffect[],
                      };
                      return setItemStats(updatedEntries);
                    }}
                  />
                ) : (
                  <Input
                    key={stat}
                    name="equipment_stat"
                    type={typeof oldStat === 'number' ? 'number' : 'text'}
                    value={String(oldStat)}
                    style={{ maxWidth: '100px' }}
                    setValue={newStat => {
                      const updatedEntries = {
                        ...itemStats,
                        [stat]: stat === 'element' ? stat : Number(newStat),
                      };
                      return setItemStats(updatedEntries);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Icon,
  Input,
  Loader,
  QueryBoundary,
  Select,
  Tooltip,
  useItemsApi,
  useMaterialsApi,
  useMonsterDropsApi,
  useSettingsApi,
} from '@mhgo/front';
import { Drop, MonsterDrop } from '@mhgo/types';

import s from './SingleMonsterView.module.scss';

type MonsterDropsProps = {
  updatedDrops: MonsterDrop['drops'];
  setUpdatedDrops: (updatedDrops: MonsterDrop['drops']) => void;
};
export const MonsterDrops = (props: MonsterDropsProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ updatedDrops, setUpdatedDrops }: MonsterDropsProps) => {
  const { data: drops, isFetched } = useMonsterDropsApi();
  const { setting: maxMonsterLevel } = useSettingsApi('max_monster_level', 5);
  const { data: items } = useItemsApi();
  const { data: materials } = useMaterialsApi();

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const monsterDrops = useMemo(
    () => drops.find(drop => drop.monsterId === id)?.drops ?? [],
    [drops],
  );

  useEffect(() => {
    setUpdatedDrops(monsterDrops);
  }, [isFetched]);

  const getSelect = (mat: Drop, level: number) => {
    if (mat.type === 'item')
      return items.map(i => ({
        id: i.id,
        name: i.name,
        disabled: Boolean(
          // Dont allow to select item currently selected
          i.id === mat.id ||
            // Dont allow to select items which are already part of recipe
            updatedDrops
              .find(entry => entry.level === level)
              ?.drops.find(entry => entry.id === i.id),
        ),
      }));

    if (mat.type === 'material')
      return materials.map(m => ({
        id: m.id,
        name: m.name,
        // Dont allow to select materials which are already part of recipe
        disabled: Boolean(
          m.id === mat.id ||
            updatedDrops
              .find(entry => entry.level === level)
              ?.drops.find(entry => entry.id === m.id),
        ),
      }));
    return [];
  };

  return (
    <div className={s.monsterDrops}>
      {new Array(maxMonsterLevel)
        .fill(1)
        .map((val, index) => val + index)
        .map(level => {
          const perLevel =
            updatedDrops.find(updatedDrop => updatedDrop.level === level)
              ?.drops ?? [];

          return (
            <div key={`level-${level}`} className={s.monsterDrops__perLevel}>
              <h3 className={s.monsterDrops__level}>Level {level}</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  label="Add item"
                  onClick={() => {
                    const newDrops: Drop[] = [
                      ...(updatedDrops.find(entry => entry.level === level)
                        ?.drops ?? []),
                      {
                        // We fake this id because if we select first item from list
                        // it will duplicate if user creates more fields at once
                        // Having a fake ID set as date ensures their uniqueness
                        // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
                        id: new Date().valueOf().toString(),
                        amount: 1,
                        type: 'item',
                        chance: 100,
                      },
                    ];
                    setUpdatedDrops([
                      ...updatedDrops.filter(d => d.level !== level),
                      { level, drops: newDrops },
                    ]);
                  }}
                />
                <Button
                  label="Add material"
                  onClick={() => {
                    const newDrops: Drop[] = [
                      ...(updatedDrops.find(entry => entry.level === level)
                        ?.drops ?? []),
                      {
                        // We fake this id because if we select first item from list
                        // it will duplicate if user creates more fields at once
                        // Having a fake ID set as date ensures their uniqueness
                        // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
                        id: new Date().valueOf().toString(),
                        amount: 1,
                        type: 'material',
                        chance: 100,
                      },
                    ];
                    setUpdatedDrops([
                      ...updatedDrops.filter(d => d.level !== level),
                      { level, drops: newDrops },
                    ]);
                  }}
                />
              </div>
              {perLevel?.map((mat, index) => {
                const matSelection = getSelect(mat, level);
                return (
                  <div
                    className={s.monsterDrops__craftMaterial}
                    key={`craftmat-${index}`}>
                    <div style={{ maxWidth: '200px', minWidth: '200px' }}>
                      <Select
                        defaultSelected={mat.id}
                        data={matSelection}
                        key={`select-${index}`}
                        name="Material"
                        setValue={selectedMatId => {
                          const updatedEntries = (
                            updatedDrops.find(entry => entry.level === level)
                              ?.drops ?? []
                          ).map(entry => {
                            if (entry.id === mat.id)
                              return { ...entry, id: selectedMatId };
                            return entry;
                          });
                          return setUpdatedDrops([
                            ...updatedDrops.filter(d => d.level !== level),
                            { level, drops: updatedEntries },
                          ]);
                        }}
                      />
                    </div>
                    <Tooltip content="Max amount of item to drop">
                      <Input
                        name="craft_amount"
                        type="number"
                        value={String(mat.amount)}
                        min={1}
                        step={1}
                        style={{ maxWidth: '65px' }}
                        setValue={selectedMatAmount => {
                          const updatedEntries = (
                            updatedDrops.find(entry => entry.level === level)
                              ?.drops ?? []
                          ).map(entry => {
                            if (entry.id === mat.id)
                              return {
                                ...entry,
                                amount: Number(selectedMatAmount),
                              };
                            return entry;
                          });
                          return setUpdatedDrops([
                            ...updatedDrops.filter(d => d.level !== level),
                            { level, drops: updatedEntries },
                          ]);
                        }}
                      />
                    </Tooltip>
                    <Tooltip content="% chance to drop">
                      <Input
                        name="craft_chance"
                        type="number"
                        value={String(mat.chance)}
                        min={1}
                        step={1}
                        style={{ maxWidth: '65px' }}
                        setValue={selectedMatChance => {
                          const updatedEntries = (
                            updatedDrops.find(entry => entry.level === level)
                              ?.drops ?? []
                          ).map(entry => {
                            if (entry.id === mat.id)
                              return {
                                ...entry,
                                chance: Number(selectedMatChance),
                              };
                            return entry;
                          });
                          return setUpdatedDrops([
                            ...updatedDrops.filter(d => d.level !== level),
                            { level, drops: updatedEntries },
                          ]);
                        }}
                      />
                    </Tooltip>
                    <Button
                      label={<Icon icon="X" />}
                      onClick={() => {
                        const updatedEntries = (
                          updatedDrops.find(entry => entry.level === level)
                            ?.drops ?? []
                        ).filter(entry => entry.id !== mat.id);
                        setUpdatedDrops([
                          ...updatedDrops.filter(d => d.level !== level),
                          {
                            level,
                            drops: updatedEntries,
                          },
                        ]);
                      }}
                      style={{ padding: 0, flex: 0 }}
                      simple
                      inverted
                      variant={Button.Variant.GHOST}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

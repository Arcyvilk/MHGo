import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  Button,
  Icon,
  Input,
  Loader,
  QueryBoundary,
  Select,
  Tooltip,
  useMonstersApi,
} from '@mhgo/front';
import { Habitat, HabitatMonster } from '@mhgo/types';

import s from './SingleHabitatView.module.scss';

type HabitatSpawnsProps = {
  habitat: Habitat;
  setHabitat: (habitat: Habitat) => void;
};
export const HabitatSpawns = (props: HabitatSpawnsProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ habitat, setHabitat }: HabitatSpawnsProps) => {
  const { data: monsters } = useMonstersApi();
  const [spawns, setSpawns] = useState(habitat.monsters ?? []);

  useEffect(() => {
    setHabitat({ ...habitat, monsters: spawns });
  }, [spawns]);

  const getSelect = (spawn: HabitatMonster) => {
    return monsters.map(m => ({
      id: m.id,
      name: m.name,
      // Dont allow to select monsters which are already spawning there
      disabled: Boolean(
        m.id === spawn.id || spawns.find(entry => entry.id === m.id),
      ),
    }));
  };

  return (
    <div className={s.habitatSpawns}>
      <h3 className={s.habitatSpawns__title}>Spawns</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          label="Add monster spawn"
          onClick={() => {
            const newSpawn: HabitatMonster = {
              // We fake this id because if we select first monster from list
              // it will duplicate if user creates more fields at once
              // Having a fake ID set as date ensures their uniqueness
              // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
              id: uuid(),
              spawnChance: 100,
            };
            setSpawns([...spawns, newSpawn]);
          }}
        />
      </div>
      {spawns.map((spawn, index) => (
        <div className={s.habitatSpawns__monster} key={`spawn-${index}`}>
          <div style={{ maxWidth: '250px', minWidth: '250px' }}>
            <Select
              defaultSelected={spawn.id}
              data={getSelect(spawn)}
              name="Monster"
              setValue={selectedMonsterId => {
                const updatedSpawn = spawns.map(entry => {
                  if (entry.id === spawn.id)
                    return { ...entry, id: selectedMonsterId };
                  return entry;
                });
                return setSpawns(updatedSpawn);
              }}
            />
          </div>
          <Tooltip content="% chance to spawn">
            <Input
              name="spawn_chance"
              type="number"
              value={String(spawn.spawnChance)}
              min={1}
              max={100}
              step={1}
              style={{ maxWidth: '65px' }}
              setValue={selectedSpawnChance => {
                const updatedSpawns = spawns.map(entry => {
                  if (entry.id === spawn.id)
                    return {
                      ...entry,
                      spawnChance: Number(selectedSpawnChance),
                    };
                  return entry;
                });
                console.log(updatedSpawns);
                return setSpawns(updatedSpawns);
              }}
            />
          </Tooltip>
          <Button
            label={<Icon icon="X" />}
            onClick={() => {
              const updatedSpawns = spawns.filter(
                entry => entry.id !== spawn.id,
              );
              setSpawns(updatedSpawns);
            }}
            style={{ padding: 0, flex: 0 }}
            simple
            inverted
            variant={Button.Variant.GHOST}
          />
        </div>
      ))}
    </div>
  );
};

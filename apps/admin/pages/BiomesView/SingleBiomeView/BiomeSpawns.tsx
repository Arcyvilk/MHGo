import { useEffect, useState } from 'react';
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
import { Biome, BiomeMonster } from '@mhgo/types';

import s from './SingleBiomeView.module.scss';

type BiomeSpawnsProps = {
  biome: Biome;
  setBiome: (biome: Biome) => void;
};
export const BiomeSpawns = (props: BiomeSpawnsProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ biome, setBiome }: BiomeSpawnsProps) => {
  const { data: monsters } = useMonstersApi();
  const [spawns, setSpawns] = useState(biome.monsters ?? []);

  useEffect(() => {
    setBiome({ ...biome, monsters: spawns });
  }, [spawns]);

  const getSelect = (spawn: BiomeMonster) => {
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
    <div className={s.biomeSpawns}>
      <h3 className={s.biomeSpawns__title}>Spawns</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          label="Add monster spawn"
          onClick={() => {
            const newSpawn: BiomeMonster = {
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
        <div className={s.biomeSpawns__monster} key={`spawn-${index}`}>
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

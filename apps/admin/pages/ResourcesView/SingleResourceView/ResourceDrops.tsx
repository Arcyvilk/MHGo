import { useEffect, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
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
  useResourceDropsApi,
} from '@mhgo/front';
import { Drop } from '@mhgo/types';

import s from './SingleResourceView.module.scss';

type ResourceDropsProps = {
  updatedDrops: Drop[];
  setUpdatedDrops: (updatedDrops: Drop[]) => void;
};
export const ResourceDrops = (props: ResourceDropsProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ updatedDrops, setUpdatedDrops }: ResourceDropsProps) => {
  const { data: drops, isFetched } = useResourceDropsApi();
  const { data: items } = useItemsApi(true);
  const { data: materials } = useMaterialsApi(true);

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const resourceDrops = useMemo(
    () => drops.find(drop => drop.resourceId === id)?.drops ?? [],
    [drops],
  );

  useEffect(() => {
    setUpdatedDrops(resourceDrops);
  }, [isFetched, resourceDrops]);

  const getSelect = (mat: Drop) => {
    if (mat.type === 'item')
      return items.map(i => ({
        id: i.id,
        name: i.name,
        disabled: Boolean(
          // Dont allow to select item currently selected
          i.id === mat.id ||
            // Dont allow to select items which are already part of recipe
            updatedDrops?.find(entry => entry.id === i.id),
        ),
      }));

    if (mat.type === 'material')
      return materials.map(m => ({
        id: m.id,
        name: m.name,
        // Dont allow to select materials which are already part of recipe
        disabled: Boolean(
          m.id === mat.id || updatedDrops?.find(entry => entry.id === m.id),
        ),
      }));
    return [];
  };

  return (
    <div className={s.resourceDrops}>
      <div className={s.resourceDrops__perLevel}>
        <h3 className={s.resourceDrops__title}>Drops</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            label="Add item"
            onClick={() => {
              const newDrop: Drop = {
                // We fake this id because if we select first item from list
                // it will duplicate if user creates more fields at once
                // Having a fake ID set as date ensures their uniqueness
                // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
                id: uuid(),
                type: 'item',
                amount: 1,
                chance: 100,
              };
              setUpdatedDrops([...updatedDrops, newDrop]);
            }}
          />
          <Button
            label="Add material"
            onClick={() => {
              const newDrop: Drop = {
                // We fake this id because if we select first material from list
                // it will duplicate if user creates more fields at once
                // Having a fake ID set as date ensures their uniqueness
                // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
                id: uuid(),
                type: 'material',
                amount: 1,
                chance: 100,
              };
              setUpdatedDrops([...updatedDrops, newDrop]);
            }}
          />
        </div>
        {updatedDrops.map((drop, index) => (
          <div
            className={s.resourceDrops__craftMaterial}
            key={`craftmat-${index}`}>
            <div style={{ maxWidth: '200px', minWidth: '200px' }}>
              <Select
                defaultSelected={drop.id}
                data={getSelect(drop)}
                name="Material"
                setValue={selectedMatId => {
                  const updatedEntries = updatedDrops.map(entry => {
                    if (entry.id === drop.id)
                      return { ...entry, id: selectedMatId };
                    return entry;
                  });
                  return setUpdatedDrops(updatedEntries);
                }}
              />
            </div>
            <Tooltip content="Max amount of material to drop">
              <Input
                name="craft_amount"
                type="number"
                value={String(drop.amount)}
                min={1}
                step={1}
                style={{ maxWidth: '65px' }}
                setValue={selectedMatAmount => {
                  const updatedEntries = updatedDrops.map(entry => {
                    if (entry.id === drop.id)
                      return {
                        ...entry,
                        amount: Number(selectedMatAmount),
                      };
                    return entry;
                  });
                  return setUpdatedDrops(updatedEntries);
                }}
              />
            </Tooltip>
            <Tooltip content="% chance to drop">
              <Input
                name="craft_chance"
                type="number"
                value={String(drop.chance)}
                min={1}
                step={1}
                style={{ maxWidth: '65px' }}
                setValue={selectedMatChance => {
                  const updatedEntries = updatedDrops.map(entry => {
                    if (entry.id === drop.id)
                      return {
                        ...entry,
                        chance: Number(selectedMatChance),
                      };
                    return entry;
                  });
                  return setUpdatedDrops(updatedEntries);
                }}
              />
            </Tooltip>
            <Button
              label={<Icon icon="X" />}
              onClick={() => {
                const updatedEntries = updatedDrops.filter(
                  entry => entry.id !== drop.id,
                );
                setUpdatedDrops(updatedEntries);
              }}
              style={{ padding: 0, flex: 0 }}
              simple
              inverted
              variant={Button.Variant.GHOST}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

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
  useMaterialsApi,
  useResourceDropsApi,
} from '@mhgo/front';
import { ResourceDrop } from '@mhgo/types';

import s from './SingleResourceView.module.scss';

type ResourceDropsProps = {
  updatedDrops: ResourceDrop[];
  setUpdatedDrops: (updatedDrops: ResourceDrop[]) => void;
};
export const ResourceDrops = (props: ResourceDropsProps) => (
  <QueryBoundary fallback={<Loader />}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ updatedDrops, setUpdatedDrops }: ResourceDropsProps) => {
  const { data: resources, isFetched } = useResourceDropsApi();
  const { data: materials } = useMaterialsApi(true);

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const resourceDrops = useMemo(
    () => resources.find(resource => resource.id === id)?.drops ?? [],
    [resources],
  );

  useEffect(() => {
    setUpdatedDrops(resourceDrops);
  }, [isFetched, resourceDrops]);

  const getSelect = (mat: ResourceDrop) => {
    // Resource points can drop only materials
    return materials.map(m => ({
      id: m.id,
      name: m.name,
      // Dont allow to select materials which are already part of recipe
      disabled: Boolean(
        m.id === mat.materialId ||
          updatedDrops?.find(entry => entry.materialId === m.id),
      ),
    }));
  };

  return (
    <div className={s.resourceDrops}>
      <div className={s.resourceDrops__perLevel}>
        <h3 className={s.resourceDrops__title}>Drops</h3>
        <Button
          label="Add material"
          onClick={() => {
            const newDrop: ResourceDrop = {
              // We fake this id because if we select first item from list
              // it will duplicate if user creates more fields at once
              // Having a fake ID set as date ensures their uniqueness
              // Hacky and ugly I know. It's 2:26AM, I deserve some leniency
              materialId: uuid(),
              amount: 1,
              chance: 100,
            };
            setUpdatedDrops([...updatedDrops, newDrop]);
          }}
        />
        {updatedDrops.map(drop => (
          <div className={s.resourceDrops__craftMaterial}>
            <div style={{ maxWidth: '200px', minWidth: '200px' }}>
              <Select
                defaultSelected={drop.materialId}
                data={getSelect(drop)}
                name="Material"
                setValue={selectedMatId => {
                  const updatedEntries = updatedDrops.map(entry => {
                    if (entry.materialId === drop.materialId)
                      return { ...entry, materialId: selectedMatId };
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
                    if (entry.materialId === drop.materialId)
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
                    if (entry.materialId === drop.materialId)
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
                  entry => entry.materialId !== drop.materialId,
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

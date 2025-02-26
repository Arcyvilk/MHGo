import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useAdminDeleteBiomeApi,
  useBiomesApi,
} from '@mhgo/front';
import { CDN_URL } from '@mhgo/front/env';
import { Biome, BiomeMonster } from '@mhgo/types';

import { ActionBar, Table, TableHeader } from '../../containers';
import { useAppContext } from '../../utils/context';

import s from './BiomesView.module.scss';

const tableHeaders: TableHeader<Biome>[] = [
  { id: 'name', label: 'Name' },
  { id: 'monsters', label: 'Spawns' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions' },
];

export const BiomesView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    orderBiome: order,
    setOrderBiome: setOrder,
    orderByBiome: orderBy,
    setOrderByBiome: setOrderBy,
  } = useAppContext();
  const navigate = useNavigate();
  const { data: biomes } = useBiomesApi();

  const {
    mutate: mutateDelete,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useAdminDeleteBiomeApi();

  useEffect(() => {
    if (isDeleteError === true) toast.error('Could not delete biome!');
    if (isDeleteSuccess === true) toast.success('Biome deleted successfully!');
  }, [isDeleteSuccess, isDeleteError]);

  const onBiomeEdit = (biome: Biome) => {
    navigate(`/biomes/edit?id=${biome.id}`);
  };

  const onBiomeDelete = (biome: Biome) => {
    const shouldDeleteBiome = confirm(
      `Are you REALLY sure you want to delete biome ${biome.name}? THIS CANNOT BE UNDONE! `,
    );
    if (shouldDeleteBiome) mutateDelete(biome.id);
  };

  const sortedBiomes = useMemo(() => {
    if (order && orderBy)
      return biomes.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return biomes;
  }, [biomes, order, orderBy]);

  const tableRows = sortedBiomes.map(biome => [
    <BiomeCell biome={biome} />,
    <SpawnCell monsters={biome.monsters} />,
    <Table.CustomCell content={biome.description} />,
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button
        label={<Icon icon="Edit" size={Size.MICRO} />}
        onClick={() => onBiomeEdit(biome)}
        style={{ width: '40px' }}
      />
      <Button
        label={<Icon icon="Trash" size={Size.MICRO} />}
        onClick={() => {
          onBiomeDelete(biome);
        }}
        variant={Button.Variant.DANGER}
        style={{ width: '40px' }}
      />
    </div>,
  ]);

  return (
    <div className={s.biomesView}>
      <div className={s.biomesView__header}>
        <h1 className={s.biomesView__title}>HABITATS</h1>
      </div>
      <ActionBar
        buttons={
          <>
            <Button
              label="Create new biome"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.biomesView__content}>
        <Table
          tableHeaders={tableHeaders}
          items={tableRows}
          order={order}
          setOrder={setOrder}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
      </div>
    </div>
  );
};

const BiomeCell = ({ biome }: { biome: Biome }) => {
  return (
    <div className={s.biomesView__detail}>
      <img
        src={`${CDN_URL}${biome.thumbnail}`}
        className={s.biomesView__icon}
      />
      {biome.name}
    </div>
  );
};

const SpawnCell = ({ monsters }: { monsters: BiomeMonster[] }) => {
  return (
    <div className={s.biomesView__spawn}>
      {monsters.map(monster => (
        <span key={monster.id}>
          [{monster.spawnChance}%] {monster.id}
        </span>
      ))}
    </div>
  );
};

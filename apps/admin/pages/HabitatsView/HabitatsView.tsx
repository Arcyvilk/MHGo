import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useHabitatsApi,
} from '@mhgo/front';
import { Habitat, HabitatMonster } from '@mhgo/types';

import { ActionBar, Table, TableHeader } from '../../containers';
import { useAppContext } from '../../utils/context';

import s from './HabitatsView.module.scss';
import { CDN_URL } from '@mhgo/front/env';

const tableHeaders: TableHeader<Habitat>[] = [
  { id: 'name', label: 'Name' },
  { id: 'monsters', label: 'Spawns' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions' },
];

export const HabitatsView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    orderHabitat: order,
    setOrderHabitat: setOrder,
    orderByHabitat: orderBy,
    setOrderByHabitat: setOrderBy,
  } = useAppContext();
  const navigate = useNavigate();
  const { data: habitats } = useHabitatsApi();

  const onHabitatEdit = (habitat: Habitat) => {
    navigate(`/habitats/edit?id=${habitat.id}`);
  };

  const sortedHabitats = useMemo(() => {
    if (order && orderBy)
      return habitats.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return habitats;
  }, [habitats, order, orderBy]);

  const tableRows = sortedHabitats.map(habitat => [
    <HabitatCell habitat={habitat} />,
    <SpawnCell monsters={habitat.monsters} />,
    <Table.CustomCell content={habitat.description} />,
    <Button
      label={<Icon icon="Edit" size={Size.MICRO} />}
      onClick={() => onHabitatEdit(habitat)}
      style={{ width: '40px' }}
    />,
  ]);

  return (
    <div className={s.habitatsView}>
      <div className={s.habitatsView__header}>
        <h1 className={s.habitatsView__title}>HABITATS</h1>
      </div>
      <ActionBar
        buttons={
          <>
            <Button
              label="Create new habitat"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.habitatsView__content}>
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

const HabitatCell = ({ habitat }: { habitat: Habitat }) => {
  return (
    <div className={s.habitatsView__detail}>
      <img
        src={`${CDN_URL}${habitat.thumbnail}`}
        className={s.habitatsView__icon}
      />
      {habitat.name}
    </div>
  );
};

const SpawnCell = ({ monsters }: { monsters: HabitatMonster[] }) => {
  return (
    <div className={s.habitatsView__spawn}>
      {monsters.map(monster => (
        <span key={monster.id}>
          [{monster.spawnChance}%] {monster.id}
        </span>
      ))}
    </div>
  );
};

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Switch } from '@mui/material';
import { Monster } from '@mhgo/types';
import {
  Button,
  Icon,
  Loader,
  QueryBoundary,
  Size,
  useAdminDeleteMonsterApi,
  useAdminUpdateMonsterApi,
  useMonstersApi,
} from '@mhgo/front';
import { ActionBar, Table, TableHeader } from '../../containers';
import { useAppContext } from '../../utils/context';

import s from './MonstersView.module.scss';

const tableHeaders: TableHeader<Monster & { baseDPS: number }>[] = [
  { id: 'disabled', label: '' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'biome', label: 'Background' },
  { id: 'baseHP', label: 'Base HP' },
  { id: 'baseDamage', label: 'Base damage' },
  { id: 'baseAttackSpeed', label: 'Base AS' },
  { id: 'baseDPS', label: 'Base DPS' },
  { id: 'baseExp', label: 'Base EXP' },
  { id: 'baseWealth', label: 'Base payment' },
  { id: 'levelRequirements', label: 'LVL req.' },
  { id: 'actions', label: 'Actions' },
];

export const MonstersView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const {
    orderMonster: order,
    setOrderMonster: setOrder,
    orderByMonster: orderBy,
    setOrderByMonster: setOrderBy,
  } = useAppContext();
  const navigate = useNavigate();
  const { data: monsters } = useMonstersApi(true);
  const {
    mutate: mutateUpdate,
    isSuccess,
    isError,
  } = useAdminUpdateMonsterApi();
  const {
    mutate: mutateDelete,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useAdminDeleteMonsterApi();

  useEffect(() => {
    if (isDeleteError === true) toast.error('Could not delete monster!');
    if (isDeleteSuccess === true)
      toast.success('Monster deleted successfully!');
  }, [isDeleteSuccess, isDeleteError]);

  const onSwitch = (
    checked: boolean,
    monster: Monster,
    property: keyof Monster,
  ) => {
    const updatedMonster = {
      ...monster,
      [property]: checked,
    };
    mutateUpdate(updatedMonster);
  };

  const onMonsterEdit = (monster: Monster) => {
    navigate(`/monsters/edit?id=${monster.id}`);
  };
  const onMonsterDelete = (monster: Monster) => {
    const shouldDeleteMonster = confirm(
      `Are you REALLY sure you want to delete monster ${monster.name}? THIS CANNOT BE UNDONE! `,
    );
    if (shouldDeleteMonster) mutateDelete(monster.id);
  };

  useEffect(() => {
    if (isSuccess) toast.success('Monster saved successfully!');
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error('Could not save the monster :c');
  }, [isError]);

  const sortedMonsters = useMemo(() => {
    // Cannot sort by DPS yet, fix in the future
    if (order && orderBy && orderBy !== 'baseDPS')
      return monsters.sort((a, b) =>
        order === 'asc'
          ? (a[orderBy] ?? 0) > (b[orderBy] ?? 0)
            ? 1
            : -1
          : (a[orderBy] ?? 0) < (b[orderBy] ?? 0)
            ? 1
            : -1,
      );
    else return monsters;
  }, [monsters, order, orderBy]);

  const tableRows = sortedMonsters.map(monster => [
    <Switch
      color="default"
      checked={!monster.disabled}
      onChange={(_, checked) => onSwitch(!checked, monster, 'disabled')}
    />,
    <MonsterCell monster={monster} />,
    <Table.CustomCell content={monster.description} />,
    monster.biome,
    monster.baseHP,
    monster.baseDamage,
    monster.baseAttackSpeed,
    monster.baseAttackSpeed * monster.baseDamage,
    monster.baseExp,
    monster.baseWealth
      .map(wealth => `${wealth.type}: ${wealth.amount}`)
      .join('; '),
    monster.levelRequirements,
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button
        label={<Icon icon="Edit" size={Size.MICRO} />}
        onClick={() => onMonsterEdit(monster)}
        style={{ width: '40px' }}
      />
      <Button
        label={<Icon icon="Trash" size={Size.MICRO} />}
        onClick={() => {
          onMonsterDelete(monster);
        }}
        variant={Button.Variant.DANGER}
        style={{ width: '40px' }}
      />
    </div>,
  ]);

  return (
    <div className={s.monstersView}>
      <div className={s.monstersView__header}>
        <h1 className={s.monstersView__title}>MONSTERS</h1>
      </div>
      <ActionBar
        buttons={
          <>
            <Button
              label="Create new monster"
              onClick={() => navigate('create')}
            />
          </>
        }
      />
      <div className={s.monstersView__content}>
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

const MonsterCell = ({ monster }: { monster: Monster }) => {
  return (
    <div className={s.monstersView__itemDetail}>
      <img
        src={monster.thumbnail}
        className={s.monstersView__itemIcon}
        draggable={false}
      />{' '}
      {monster.name}
    </div>
  );
};

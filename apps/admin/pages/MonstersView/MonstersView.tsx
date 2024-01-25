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
  { id: 'habitat', label: 'Habitat' },
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
  const { mutate, isSuccess, isError } = useAdminUpdateMonsterApi();

  const onSwitch = (
    checked: boolean,
    monster: Monster,
    property: keyof Monster,
  ) => {
    const updatedMonster = {
      ...monster,
      [property]: checked,
    };
    mutate(updatedMonster);
  };

  const onMonsterEdit = (monster: Monster) => {
    navigate(`/monsters/edit?id=${monster.id}`);
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
    monster.habitat,
    monster.baseHP,
    monster.baseDamage,
    monster.baseAttackSpeed,
    monster.baseAttackSpeed * monster.baseDamage,
    monster.baseExp,
    monster.baseWealth
      .map(wealth => `${wealth.type}: ${wealth.amount}`)
      .join('; '),
    monster.levelRequirements,
    <Button
      label={<Icon icon="Edit" size={Size.MICRO} />}
      onClick={() => onMonsterEdit(monster)}
      style={{ width: '40px' }}
    />,
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

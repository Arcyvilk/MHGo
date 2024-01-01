import { useMonstersApi } from '@mhgo/front';
import { Table } from '../../containers';

import s from './MonstersView.module.scss';
import { Monster } from '@mhgo/types';

export const MonstersView = () => {
  const { data: monsters } = useMonstersApi();

  const tableHeaders = [
    'Name',
    'Habitat',
    'Base HP',
    'Base damage',
    'Base AS',
    'Base DPS',
    'Base EXP',
    'Base payment',
  ];

  const tableRows = monsters.map(monster => [
    <MonsterCell monster={monster} />,
    monster.habitat,
    monster.baseHP,
    monster.baseDamage,
    monster.baseAttackSpeed,
    monster.baseAttackSpeed * monster.baseDamage,
    monster.baseExp,
    String(monster.baseWealth),
  ]);

  return (
    <div className={s.monstersView}>
      <div className={s.monstersView__header}>
        <h1 className={s.monstersView__title}>MONSTERS</h1>
      </div>
      <Table tableHeaders={tableHeaders} items={tableRows} />
    </div>
  );
};

const MonsterCell = ({ monster }: { monster: Monster }) => {
  return (
    <div className={s.monstersView__itemDetail}>
      <img src={monster.thumbnail} className={s.monstersView__itemIcon} />{' '}
      {monster.name}
    </div>
  );
};

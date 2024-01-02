import { useNavigate } from 'react-router-dom';
import { Monster } from '@mhgo/types';
import { Button, Icon, Size, useMonstersApi } from '@mhgo/front';
import { ActionBar, Table } from '../../containers';

import s from './MonstersView.module.scss';

const tableHeaders = [
  'Name',
  'Habitat',
  'Base HP',
  'Base damage',
  'Base AS',
  'Base DPS',
  'Base EXP',
  'Base payment',
  'Actions',
];

export const MonstersView = () => {
  const navigate = useNavigate();
  const { data: monsters } = useMonstersApi();

  const onMonsterEdit = (monster: Monster) => {
    navigate(`/monsters/edit?id=${monster.id}`);
  };

  const tableRows = monsters.map(monster => [
    <MonsterCell monster={monster} />,
    monster.habitat,
    monster.baseHP,
    monster.baseDamage,
    monster.baseAttackSpeed,
    monster.baseAttackSpeed * monster.baseDamage,
    monster.baseExp,
    String(monster.baseWealth),
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
        <Table tableHeaders={tableHeaders} items={tableRows} />
      </div>
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

import { CloseButton } from '../../components';
import { Item } from '../../containers';
import { useMonsters } from '../../api/useMonsters';
import { Material, Monster, MonsterDrop } from '../../api/types';

import s from './MonsterGuideView.module.scss';

import { monsterDrops } from '../../_mock/drops';
import { materials } from '../../_mock/materials';

export const MonsterGuideView = () => {
  const { data: monsters } = useMonsters();
  return (
    <div className={s.monsterGuideView}>
      <div className={s.header}>
        <div className={s.header__title}>Monster Guide</div>
      </div>
      <div className={s.monsterGuideView__monsters}>
        {monsters.map(monster => (
          <MonsterTile
            monster={monster}
            drops={monsterDrops}
            key={monster.id}
          />
        ))}
      </div>
      <CloseButton />
    </div>
  );
};

const MonsterTile = ({
  monster,
  drops,
}: {
  monster: Monster;
  drops: MonsterDrop[];
}) => {
  const allMonsterDrops =
    drops.find(drop => drop.monsterId === monster.id)?.drops ?? [];
  const uniqueMonsterDrops = [
    ...new Set(
      allMonsterDrops
        .map(drops => drops.drops)
        .flat()
        .map(drop => drop.materialId),
    ),
  ]
    .map(dropId => materials.find(material => material.id === dropId))
    .filter(Boolean) as Material[];

  return (
    <div className={s.monster}>
      <img className={s.monster__thumbnail} src={monster.thumbnail} />
      <div className={s.monster__details}>
        <h2 className={s.monster__name}>{monster.name}</h2>
        <div className={s.monster__table}>
          <div className={s.monster__detail}>
            Found in: <span style={{ fontWeight: 400 }}>{monster.habitat}</span>
          </div>
          <div className={s.monster__detail}>
            Weakness: <span style={{ fontWeight: 400 }}>getting killed</span>
          </div>
          <div className={s.monster__detail}>
            Drops:{' '}
            <div className={s.monster__drops}>
              {uniqueMonsterDrops.map(drop => (
                <Item {...drop} simple key={drop.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

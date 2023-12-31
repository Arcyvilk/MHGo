import { Material, Monster, Item as TItem, Drop } from '@mhgo/types';

import { Item } from '../../containers';
import { CloseButton, Loader, QueryBoundary, Tooltip } from '@mhgo/front';
import { useMonstersApi, useMonsterDropsApi, useMaterialsApi } from '../../api';

import s from './MonsterGuideView.module.scss';
import { useItems } from '../../hooks/useItems';

export const MonsterGuideView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { data: monsters } = useMonstersApi();

  return (
    <div className={s.monsterGuideView}>
      <div className={s.header}>
        <div className={s.header__title}>Monster Guide</div>
      </div>
      <div className={s.monsterGuideView__monsters}>
        {monsters.map(monster => (
          <MonsterTile monster={monster} key={monster.id} />
        ))}
      </div>
      <CloseButton />
    </div>
  );
};

const MonsterTile = ({ monster }: { monster: Monster }) => {
  const { items } = useItems();
  const { data: materials } = useMaterialsApi();
  const { data: drops } = useMonsterDropsApi();

  const allMonsterDrops = (
    drops.find(drop => drop.monsterId === monster.id)?.drops ?? []
  )
    .map(drops => drops.drops)
    .flat();

  const uniqueMonsterDrops = [
    ...getUniqueItemDrops(allMonsterDrops, items),
    ...getUniqueMaterialDrops(allMonsterDrops, materials),
  ];

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
              {uniqueMonsterDrops.map(drop => {
                const data = { ...drop, purchasable: false, price: 0 };
                return (
                  <Tooltip content={drop.name}>
                    <Item data={data} simple key={drop.id} />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getUniqueItemDrops = (allDrops: Drop[], items: TItem[]) => {
  const itemMonsterDrops = allDrops.filter(drop => drop.type === 'item');
  const uniqueMonsterItemDrops = [
    ...new Set(itemMonsterDrops.map(drop => drop.id)),
  ]
    .map(dropId => items.find(item => item.id === dropId))
    .filter(Boolean) as TItem[];

  return uniqueMonsterItemDrops;
};

const getUniqueMaterialDrops = (allDrops: Drop[], materials: Material[]) => {
  const materialMonsterDrops = allDrops.filter(
    drop => drop.type === 'material',
  );

  const uniqueMonsterMaterialDrops = [
    ...new Set(materialMonsterDrops.map(drop => drop.id)),
  ]
    .map(dropId => materials.find(material => material.id === dropId))
    .filter(Boolean) as Material[];

  return uniqueMonsterMaterialDrops;
};

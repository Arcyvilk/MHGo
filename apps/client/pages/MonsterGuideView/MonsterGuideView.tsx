import { Material, Monster, Item as TItem, Drop } from '@mhgo/types';

import { Item, addCdnUrl, modifiers, useItemsApi } from '@mhgo/front';
import { CloseButton, Loader, QueryBoundary, Tooltip } from '@mhgo/front';
import {
  useMonstersApi,
  useMonsterDropsApi,
  useMaterialsApi,
} from '@mhgo/front';

import s from './MonsterGuideView.module.scss';
import { useUser } from '../../hooks/useUser';

export const MonsterGuideView = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const { data: monsters } = useMonstersApi();
  const sortedMonsters = monsters
    .filter(m => !m.hideInGuide)
    .sort((a, b) => {
      if ((a.levelRequirements ?? 0) > (b.levelRequirements ?? 0)) return 1;
      return -1;
    });
  const extinctMonsters = sortedMonsters.filter(m => m.extinct);
  const aliveMonsters = sortedMonsters.filter(m => !m.extinct);

  const allMonsters = [...aliveMonsters, ...extinctMonsters];

  return (
    <div className={s.monsterGuideView}>
      <div className={s.header}>
        <div className={s.header__title}>Monster Guide</div>
      </div>
      <div className={s.monsterGuideView__monsters}>
        {allMonsters.map(monster => (
          <MonsterTile monster={monster} key={monster.id} />
        ))}
      </div>
      <CloseButton />
    </div>
  );
};

const MonsterTile = ({ monster }: { monster: Monster }) => {
  const { userLevel } = useUser();
  const { data: items } = useItemsApi();
  const { data: materials } = useMaterialsApi();
  const { data: drops } = useMonsterDropsApi();

  const isMonsterLocked = userLevel < (monster.levelRequirements ?? 0);

  const allMonsterDrops = (
    drops.find(drop => drop.monsterId === monster.id)?.drops ?? []
  )
    .map(drops => drops.drops)
    .flat();

  const uniqueMonsterDrops = [
    ...getUniqueItemDrops(allMonsterDrops, items),
    ...getUniqueMaterialDrops(allMonsterDrops, materials),
  ];

  if (isMonsterLocked)
    return (
      <div className={s.monster}>
        <img
          className={modifiers(s, 'monster__thumbnail', { locked: true })}
          src={monster.thumbnail}
        />
        <div className={s.monster__details}>
          <h2 className={s.monster__name}>
            Unlocks at level {monster.levelRequirements}
          </h2>
        </div>
      </div>
    );
  return (
    <div className={s.monster}>
      <img
        src={monster.thumbnail}
        className={modifiers(s, 'monster__thumbnail', {
          isExtinct: monster.extinct,
        })}
      />
      <div className={s.monster__details}>
        <h2 className={s.monster__name}>{monster.name}</h2>
        {monster.extinct ? (
          <img
            src={addCdnUrl('/misc/extinct.png')}
            className={s.monster__extinct}
          />
        ) : (
          <div className={s.monster__table}>
            <div className={s.monster__detail}>
              Found in:{' '}
              <span style={{ fontWeight: 400 }}>{monster.habitat}</span>
            </div>
            <div className={s.monster__detail}>
              Weakness: <span style={{ fontWeight: 400 }}>getting killed</span>
            </div>
            <div className={s.monster__detail}>
              Drops:{' '}
              <div className={s.monster__drops}>
                {uniqueMonsterDrops.map(drop => {
                  const data = { ...drop, purchasable: false };
                  return (
                    <Tooltip content={drop.name}>
                      <Item data={data} simple key={drop.id} />
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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

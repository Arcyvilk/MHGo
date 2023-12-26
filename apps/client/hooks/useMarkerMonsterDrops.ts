import { useMemo } from 'react';
import { happensWithAChanceOf } from '@mhgo/utils';
import { Item as TItem, Material, CraftType } from '@mhgo/types';

import { useMonsterMarkersApi, useMonsterDropsApi } from '../api';
import { useMaterials } from './useMaterials';
import { useUser } from './useUser';
import { useItems } from './useItems';

export const useMarkerMonsterDrops = (
  markerId: string | null,
  level: string | null,
) => {
  const { materials } = useMaterials();
  const { items } = useItems();
  const { userId } = useUser();
  const { data: monsterMarkers } = useMonsterMarkersApi(userId);
  const { data: monsterDrops } = useMonsterDropsApi();

  if (!markerId)
    return {
      monsterDrop: {},
    };

  const monsterMarker = monsterMarkers.find(m => m.id === markerId);
  const monsterLevel = monsterMarker?.level ?? Number(level);
  const monsterId = monsterMarker?.monsterId;

  const monsterDropData = monsterDrops.find(m => m.monsterId === monsterId);
  const monsterDrop =
    monsterDropData?.drops.find(drop => drop.level === monsterLevel)?.drops ??
    [];

  const allDrops = useMemo(
    () =>
      monsterDrop
        .map(drop => {
          const d = new Array(drop.amount)
            .fill(drop)
            .filter(drop => happensWithAChanceOf(drop.chance));
          return d;
        })
        .flat()
        .map(drop => ({ id: drop.id, type: drop.type })),
    [markerId],
  );

  const drops = [
    ...getUniqueMaterialDrops(allDrops, materials),
    ...getUniqueItemDrops(allDrops, items),
  ];

  return { drops };
};

const getUniqueMaterialDrops = (
  allDrops: { id: string; type: CraftType }[],
  materials: Material[],
) => {
  const allMaterialDrops = allDrops.filter(
    drop => drop.type === 'material',
  );
  const uniqueMaterialDropIds = [
    ...new Set(allMaterialDrops.map(drop => drop.id)),
  ];

  const materialDrops = uniqueMaterialDropIds
    .map(uniqueDropId => {
      const material = materials.find(m => m.id === uniqueDropId);
      const amount =
        allMaterialDrops.filter(dropId => dropId.id === uniqueDropId).length ??
        0;
      return {
        ...material,
        dropClass: 'material',
        amount,
      };
    })
    .filter(Boolean) as (Material & { dropClass: CraftType; amount: number })[];

  return materialDrops;
};

const getUniqueItemDrops = (
  allDrops: { id: string; type: CraftType }[],
  items: TItem[],
) => {
  const allItemDrops = allDrops.filter(drop => drop.type === 'item');
  const uniqueItemDropIds = [...new Set(allItemDrops.map(drop => drop.id))];
  const itemDrops = uniqueItemDropIds
    .map(uniqueDropId => {
      const item = items.find(i => i.id === uniqueDropId);
      const amount =
        allItemDrops.filter(dropId => dropId.id === uniqueDropId).length ?? 0;
      return {
        ...item,
        dropClass: 'item',
        amount,
      };
    })
    .filter(Boolean) as (TItem & { dropClass: CraftType; amount: number })[];

  return itemDrops;
};

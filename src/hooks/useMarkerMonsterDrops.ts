import { useMemo } from 'react';
import { happensWithAChanceOf } from '../utils/rng';
import {
  Item as TItem,
  Material,
  useMonsterMarkersApi,
  ItemClass,
} from '../api';
import { useMaterials } from './useMaterials';
import { useMonsterDropsApi } from '../api/useMonsterDropsApi';
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
  allDrops: { id: string; type: ItemClass }[],
  materials: Material[],
) => {
  const allMaterialDrops = allDrops.filter(
    drop => drop.type === ItemClass.MATERIAL,
  );
  const uniqueMaterialDropIds = [
    ...new Set(allMaterialDrops.map(drop => drop.id)),
  ];

  const materialDrops: Material[] = uniqueMaterialDropIds
    .map(uniqueDropId => {
      const material = materials.find(m => m.id === uniqueDropId);
      const amount =
        allMaterialDrops.filter(dropId => dropId.id === uniqueDropId).length ??
        0;
      return {
        ...material,
        amount,
      };
    })
    .filter(Boolean) as Material[];

  return materialDrops;
};

const getUniqueItemDrops = (
  allDrops: { id: string; type: ItemClass }[],
  items: TItem[],
) => {
  const allItemDrops = allDrops.filter(drop => drop.type === ItemClass.ITEM);
  const uniqueItemDropIds = [...new Set(allItemDrops.map(drop => drop.id))];
  const itemDrops: TItem[] = uniqueItemDropIds
    .map(uniqueDropId => {
      const item = items.find(i => i.id === uniqueDropId);
      const amount =
        allItemDrops.filter(dropId => dropId.id === uniqueDropId).length ?? 0;
      return {
        ...item,
        amount,
      };
    })
    .filter(Boolean) as TItem[];

  return itemDrops;
};

import { useMemo } from 'react';

import { happensWithAChanceOf } from '../utils/rng';
import { monsterDrops } from '../_mock/drops';
import { monsterMarkers } from '../_mock/mapMarkers';
import { Material, materials } from '../_mock/materials';

export const useMonsterDrops = (markerId: string | null) => {
  if (!markerId)
    return {
      monsterDrop: {},
    };

  const monsterMarker = monsterMarkers.find(m => m.id === markerId);
  const monsterLevel = monsterMarker?.level;
  const monsterId = monsterMarker?.monsterId;

  // const monsterData = monsters.find(m => m.id === monsterId);
  const monsterDropData = monsterDrops.find(m => m.monsterId === monsterId);
  const monsterDrop =
    monsterDropData?.drops.find(drop => drop.level === monsterLevel)?.drops ??
    [];

  const dropIds = useMemo(
    () =>
      monsterDrop
        .map(drop => {
          const d = new Array(drop.amount)
            .fill(drop)
            .filter(drop => happensWithAChanceOf(drop.chance));
          return d;
        })
        .flat()
        .map(drop => drop.materialId),
    [markerId],
  );

  const uniqueDropIds = [...new Set(dropIds)];

  const drops: Material[] = uniqueDropIds
    .map(uniqueDropId => {
      const material = materials.find(material => material.id === uniqueDropId);
      const amount =
        dropIds.filter(dropId => dropId === uniqueDropId).length ?? 0;
      return {
        ...material,
        amount,
      };
    })
    .filter(Boolean) as Material[];

  return { drops };
};

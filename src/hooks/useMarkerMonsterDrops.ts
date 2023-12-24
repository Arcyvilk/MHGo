import { useMemo } from 'react';
import { happensWithAChanceOf } from '../utils/rng';
import { Material, useMonsterMarkersApi } from '../api';
import { useMaterials } from './useMaterials';
import { useMonsterDropsApi } from '../api/useMonsterDropsApi';
import { useUser } from './useUser';

export const useMarkerMonsterDrops = (
  markerId: string | null,
  level: string | null,
) => {
  const { materials } = useMaterials();
  const { userId, userLevel } = useUser();
  const { data: monsterMarkers } = useMonsterMarkersApi(userId, userLevel);
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

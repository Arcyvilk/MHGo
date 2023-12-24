import { useMemo } from 'react';
import L from 'leaflet';
import { useUser } from '../hooks/useUser';
import { MONSTER_MISSING, MONSTER_MARKER_MISSING } from '../utils/consts';
import { useMonstersApi, useMonsterMarkersApi } from '../api';

import s from '../pages/HomeView/Map/MonsterMarkers.module.scss';

export const useMonster = () => {
  const { userLevel, userId } = useUser();
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers } = useMonsterMarkersApi(userId, userLevel);

  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');

  const monsterMarker = monsterMarkers.find(m => m.id === markerId);
  const monsterId = monsterMarker?.monsterId;
  const monsterData = monsters.find(m => m.id === monsterId);

  if (!monsterMarker || !monsterData)
    return {
      markerId: null,
      monster: {
        ...MONSTER_MISSING,
        ...MONSTER_MARKER_MISSING,
      },
    };

  const monster = {
    ...monsterData,
    ...monsterMarker,
  };

  return { markerId, monster };
};

export const useMonsterMarkers = () => {
  const { userId, userLevel } = useUser();
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers } = useMonsterMarkersApi(userId, userLevel);

  const monsterMarkersData = useMemo(() => {
    if (!monsterMarkers || !monsters) return [];
    return monsterMarkers?.map(monsterMarker => {
      const { thumbnail, name } =
        monsters?.find(m => m.id === monsterMarker.monsterId) ?? {};
      console.log(thumbnail, name);
      const iconMarker = new L.Icon({
        iconUrl: thumbnail,
        iconRetinaUrl: thumbnail,
        iconSize: new L.Point(48, 48),
        className: s.monsterMarker,
      });
      return {
        ...monsterMarker,
        thumbnail: iconMarker,
        name,
      };
    });
  }, [monsterMarkers, monsters]);

  return monsterMarkersData;
};

import L from 'leaflet';
import { useUser } from '../hooks/useUser';
import { randomNumberBetween } from '../utils/rng';
import { MONSTER_MISSING, MONSTER_MARKER_MISSING } from '../utils/consts';
import { Monster, MonsterMarker } from '../api/types';
import { useMonstersApi } from '../api/useMonstersApi';

import s from '../pages/HomeView/Map/MonsterMarkers.module.scss';

import { monsterMarkers } from '../_mock/mapMarkers';

type ExpandedMonsterMarker = {
  markerId: string | null;
  monster: Monster & Omit<MonsterMarker, 'level'> & { level: number };
};
export const useMonster = () => {
  const { userLevel } = useUser();
  const { data: monsters, isLoading, isFetched } = useMonstersApi();

  const determineMonsterLevel = () => {
    const params = new URLSearchParams(location.search);
    const level = params.get('level');
    const randomMonsterLevel = randomNumberBetween(
      1,
      userLevel > 5 ? 5 : userLevel,
    );

    return level ? Number(level) : randomMonsterLevel;
  };

  const getMonster = (): ExpandedMonsterMarker => {
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
      level: monsterMarker.level ?? determineMonsterLevel(),
    };

    return { markerId, monster };
  };

  const getMonsterMarkers = () => {
    const monsterMarkersData = monsterMarkers.map(monsterMarker => {
      const { thumbnail, name } =
        monsters.find(m => m.id === monsterMarker.monsterId) ?? {};
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
        level: monsterMarker.level ?? determineMonsterLevel(),
      };
    });

    return monsterMarkersData;
  };

  return {
    isLoading,
    isFetched,
    getMonster,
    getMonsterMarkers,
    determineMonsterLevel,
  };
};

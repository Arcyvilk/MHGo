import L from 'leaflet';
import {
  LSKeys,
  useLocalStorage,
  useMonstersApi,
  useNavigateWithScroll,
  useSettingsApi,
  useSingleMonsterMarkerApi,
} from '@mhgo/front';

import {
  MONSTER_MISSING,
  MONSTER_MARKER_MISSING,
  DEFAULT_COORDS,
} from '../utils/consts';
import { useEffect } from 'react';

export const useMonsterMarker = () => {
  const { navigateWithoutScroll } = useNavigateWithScroll();

  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const level = params.get('level') ?? '0';

  useEffect(() => {
    if (!markerId) navigateWithoutScroll('/');
  }, [markerId]);

  const isTutorial = markerId === 'tutorial';
  const isDummy = markerId === 'dummy';

  const { data: monsters, isFetched: isFetchedMonster } = useMonstersApi();
  const { data: monsterMarker, isFetched: isSingleMarkerFetched } =
    useSingleMonsterMarkerApi(markerId, isTutorial, isDummy);

  const { inRange } = useMonsterMarkerDistance(isTutorial);

  // I sincerely apologize for this nested ternary
  const monsterId = isTutorial
    ? 'tutorial'
    : isDummy
      ? 'dummy'
      : monsterMarker?.monsterId;
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
    level: monsterMarker.level ?? Number(level) ?? 0,
  };

  return {
    markerId,
    monster,
    inRange,
    isTutorial,
    isDummy,
    isFetched: isFetchedMonster && isSingleMarkerFetched,
  };
};

const useMonsterMarkerDistance = (isTutorial?: boolean) => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');

  const { setting: mapRadius } = useSettingsApi('map_radius', 0);
  const { data: monsterMarker, isFetched } =
    useSingleMonsterMarkerApi(markerId);
  const [coords] = useLocalStorage(
    LSKeys.MHGO_LAST_KNOWN_LOCATION,
    DEFAULT_COORDS,
  );

  const coordsMonster = monsterMarker?.coords ?? [0, 0];
  const coordsUser = coords ?? [0, 0];

  const positionMonster = new L.LatLng(coordsMonster[0], coordsMonster[1]);
  const positionUser = new L.LatLng(coordsUser[0], coordsUser[1]);

  const distance = positionUser.distanceTo(positionMonster);
  const inRange = isTutorial ? true : distance <= mapRadius!;

  return { distance, inRange, isFetched };
};

import L from 'leaflet';
import {
  useLocalStorage,
  useMonstersApi,
  useSettingsApi,
  useSingleMonsterMarkerApi,
} from '@mhgo/front';

import {
  MONSTER_MISSING,
  MONSTER_MARKER_MISSING,
  DEFAULT_COORDS,
} from '../utils/consts';

export const useMonsterMarker = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const level = params.get('level') ?? '0';
  const { data: monsters, isFetched: isFetchedMonster } = useMonstersApi();
  const { data: monsterMarker, isFetched: isSingleMarkerFetched } =
    useSingleMonsterMarkerApi(markerId);

  const { inRange } = useMonsterMarkerDistance();

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
    level: monsterMarker.level ?? Number(level) ?? 0,
  };

  return {
    markerId,
    monster,
    inRange,
    isFetched: isFetchedMonster && isSingleMarkerFetched,
  };
};

const useMonsterMarkerDistance = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');

  const { setting: mapRadius } = useSettingsApi('map_radius', 0);
  const { data: monsterMarker, isFetched } =
    useSingleMonsterMarkerApi(markerId);
  const [coords] = useLocalStorage('MHGO_LAST_KNOWN_LOCATION', DEFAULT_COORDS);

  const coordsMonster = monsterMarker?.coords ?? [0, 0];
  const coordsUser = coords ?? [0, 0];

  const positionMonster = new L.LatLng(coordsMonster[0], coordsMonster[1]);
  const positionUser = new L.LatLng(coordsUser[0], coordsUser[1]);

  const distance = positionUser.distanceTo(positionMonster);
  const inRange = distance <= mapRadius;

  return { distance, inRange, isFetched };
};

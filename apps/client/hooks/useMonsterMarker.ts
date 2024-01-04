import { useMonstersApi, useSingleMonsterMarkerApi } from '@mhgo/front';

import { MONSTER_MISSING, MONSTER_MARKER_MISSING } from '../utils/consts';

export const useMonsterMarker = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');
  const { data: monsters, isFetched: isFetchedMonster } = useMonstersApi();
  const { data: monsterMarker, isFetched: isSingleMarkerFetched } =
    useSingleMonsterMarkerApi(markerId);

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
    level: monsterMarker.level ?? 1,
  };

  return {
    markerId,
    monster,
    isFetched: isFetchedMonster && isSingleMarkerFetched,
  };
};

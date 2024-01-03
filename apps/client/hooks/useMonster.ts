import { useMonstersApi, useMonsterMarkersApi } from '@mhgo/front';
import { useUser } from '../hooks/useUser';
import { MONSTER_MISSING, MONSTER_MARKER_MISSING } from '../utils/consts';

export const useMonster = () => {
  const { userId } = useUser();
  const { data: monsters } = useMonstersApi();
  const { data: monsterMarkers } = useMonsterMarkersApi(userId);

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
    level: monsterMarker.level ?? 1,
  };

  return { markerId, monster };
};

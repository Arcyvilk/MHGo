import { monsters } from '../_mock/monsters';
import { monsterMarkers } from '../_mock/mapMarkers';

export const useMonster = () => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id');

  const monsterMarker = monsterMarkers.find(m => m.id === markerId);
  const monsterId = monsterMarker?.monsterId;

  const monsterData = monsters.find(m => m.id === monsterId);
  const monster = {
    ...monsterData,
    ...monsterMarker,
  };

  return { markerId, monster };
};

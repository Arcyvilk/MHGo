import { useCallback, useState } from 'react';

export enum LSKeys {
  // Auth related
  MHGO_ADVENTURE = 'MHGO_ADVENTURE',
  MHGO_AUTH = 'MHGO_AUTH',
  MHGO_CACHE_ID = 'MHGO_CACHE_ID',
  // Gameplay related
  MHGO_QUEST_FILTERS = 'MHGO_QUEST_FILTERS',
  MHGO_EQUIPMENT_FILTERS = 'MHGO_EQUIPMENT_FILTERS',
  MHGO_MAP_ZOOM = 'MHGO_MAP_ZOOM',
  MHGO_LAST_KNOWN_LOCATION = 'MHGO_LAST_KNOWN_LOCATION',
  MHGO_HOME_POSITION = 'MHGO_HOME_POSITION',
  MHGO_TUTORIAL = 'MHGO_TUTORIAL',
  MHGO_TUTORIAL_DUMMY = 'MHGO_TUTORIAL_DUMMY',
  MHGO_VOLUME = 'MHGO_VOLUME',
}

export const useLocalStorage = <T extends Record<string, any>>(
  key: string,
  initialValue: T,
) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) return JSON.parse(item);
      else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
    } catch (error: any) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | null) => {
      try {
        if (value === null) {
          window.localStorage.removeItem(key);
          return;
        }
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    [key, initialValue],
  );

  return [storedValue, setValue] as const;
};

import { useCallback, useState } from 'react';

export const useSessionStorage = (key: string, initialValue: boolean) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = Boolean(window.sessionStorage.getItem(key));

      return item ?? initialValue;
    } catch (error: any) {
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.
  const setValue = useCallback(
    (value: boolean) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, String(value));
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    [key, initialValue],
  );
  return [storedValue, setValue] as const;
};

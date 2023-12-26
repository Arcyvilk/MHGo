import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../utils/consts';

/**
 *
 * @returns
 */
export const useSettingsApi = <T>(key: string, defaultValue: T) => {
  const getSettings = async (): Promise<Record<string, T>[]> => {
    const res = await fetch(`${API_URL}/news/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Record<string, any>[], unknown, Record<string, any>[], string[]>(
    {
      queryKey: ['settings'],
      queryFn: getSettings,
    },
  );

  const setting = data.find(d => d.key === key)?.value ?? defaultValue;

  return { setting, isLoading, isFetched, isError };
};

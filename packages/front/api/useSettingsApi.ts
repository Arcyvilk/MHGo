import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../env';

/**
 *
 * @returns
 */
export const useSettingsApi = <T>(key: string, defaultValue: T) => {
  const getSettings = async (): Promise<Record<string, T>[]> => {
    const res = await fetch(`${API_URL}/settings`);
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

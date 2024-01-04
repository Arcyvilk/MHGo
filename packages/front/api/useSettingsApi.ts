import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../env';

export const useSettingsApi = <T>(key: string, defaultValue?: T) => {
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

  const setting = data.find(d => d.key === key)?.value ?? defaultValue ?? {};

  return { setting, isLoading, isFetched, isError };
};

export const useAllSettingsApi = <T>() => {
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
      queryKey: ['settings', 'all'],
      queryFn: getSettings,
    },
  );

  return { data, isLoading, isFetched, isError };
};

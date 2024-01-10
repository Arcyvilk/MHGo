import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../env';
import { Settings } from '@mhgo/types';
import { fetcher } from '..';

export const useSettingsApi = <T>(key: string, defaultValue?: T) => {
  const getSettings = async (): Promise<Settings<T>> => {
    const res = await fetcher(`${API_URL}/settings`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Settings<T>, unknown, Settings<T>, string[]>({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const setting = data.find(d => d.key === key)?.value ?? defaultValue;

  return { setting, isLoading, isFetched, isError };
};

export const useAllSettingsApi = () => {
  const getSettings = async (): Promise<Settings<unknown>> => {
    const res = await fetcher(`${API_URL}/settings`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Settings<unknown>, unknown, Settings<unknown>, string[]>({
    queryKey: ['settings', 'all'],
    queryFn: getSettings,
  });

  return { data, isLoading, isFetched, isError };
};

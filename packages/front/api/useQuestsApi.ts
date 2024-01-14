import { useQuery } from '@tanstack/react-query';
import { Quest, UserQuestDaily } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

export const useQuestsDailyApi = () => {
  const getQuestsDaily = async (): Promise<Quest[]> => {
    const res = await fetcher(`${API_URL}/quests/daily/list`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    Quest[],
    unknown,
    Quest[],
    string[]
  >({
    queryKey: ['quests', 'daily'],
    queryFn: getQuestsDaily,
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserQuestsDailyApi = (userId: string | null | undefined) => {
  const getUserQuestsDaily = async (): Promise<UserQuestDaily> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}/quests/daily`);
    return res.json();
  };

  const { data, isLoading, isFetched, isError } = useQuery<
    UserQuestDaily,
    unknown,
    UserQuestDaily,
    string[]
  >({
    queryKey: ['user', userId!, 'quests', 'daily'],
    queryFn: getUserQuestsDaily,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

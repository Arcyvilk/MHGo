import { useSuspenseQuery } from '@tanstack/react-query';
import { Quest } from '@mhgo/types';

import { API_URL } from '../../env';
import { fetcher } from '../..';

export const useAdminGetAllQuestsDailyApi = () => {
  const getAllQuestsDaily = async (): Promise<Quest[]> => {
    const res = await fetcher(`${API_URL}/admin/quests/daily/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Quest[], unknown, Quest[], string[]>({
    queryKey: ['admin', 'quests', 'daily', 'all'],
    queryFn: getAllQuestsDaily,
  });

  return { data, isLoading, isFetched, isError };
};

export const useAdminGetAllQuestsStoryApi = () => {
  const getAllQuestsStory = async (): Promise<Quest[]> => {
    const res = await fetcher(`${API_URL}/admin/quests/story/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useSuspenseQuery<Quest[], unknown, Quest[], string[]>({
    queryKey: ['admin', 'quests', 'story', 'all'],
    queryFn: getAllQuestsStory,
  });

  return { data, isLoading, isFetched, isError };
};

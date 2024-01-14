import { useQuery } from '@tanstack/react-query';
import { Quest, UserQuestDaily, UserQuestStory } from '@mhgo/types';

import { API_URL } from '../env';
import { fetcher } from '..';

/**
 * STORY QUESTS
 */
export const useQuestsStoryApi = () => {
  const getQuestsStory = async (): Promise<Quest[]> => {
    const res = await fetcher(`${API_URL}/quests/story/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Quest[], unknown, Quest[], string[]>({
    queryKey: ['quests', 'story'],
    queryFn: getQuestsStory,
  });

  return { data, isLoading, isFetched, isError };
};

export const useUserQuestsStoryApi = (userId: string | null | undefined) => {
  const getUserQuestsStory = async (): Promise<UserQuestStory[]> => {
    const res = await fetcher(`${API_URL}/users/user/${userId}/quests/story`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<UserQuestStory[], unknown, UserQuestStory[], string[]>({
    queryKey: ['user', userId!, 'quests', 'story'],
    queryFn: getUserQuestsStory,
    enabled: Boolean(userId),
  });

  return { data, isLoading, isFetched, isError };
};

/**
 * DAILY QUESTS
 */
export const useQuestsDailyApi = () => {
  const getQuestsDaily = async (): Promise<Quest[]> => {
    const res = await fetcher(`${API_URL}/quests/daily/list`);
    return res.json();
  };

  const {
    data = [],
    isLoading,
    isFetched,
    isError,
  } = useQuery<Quest[], unknown, Quest[], string[]>({
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

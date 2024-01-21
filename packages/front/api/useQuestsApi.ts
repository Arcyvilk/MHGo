import {
  useMutation,
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';
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
  } = useSuspenseQuery<Quest[], unknown, Quest[], string[]>({
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
  } = useSuspenseQuery<UserQuestStory[], unknown, UserQuestStory[], string[]>({
    queryKey: ['user', userId!, 'quests', 'story'],
    queryFn: getUserQuestsStory,
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

export const useUpdateUserDailyQuestApi = (userId: string) => {
  const queryClient = useQueryClient();

  const updateUserDailyQuests = async (variables: {
    questId: string;
    progress: number;
    isClaimed: boolean;
  }): Promise<void> => {
    const { questId, progress, isClaimed } = variables;
    await fetcher(`${API_URL}/users/user/${userId}/quests/daily/${questId}`, {
      method: 'PUT',
      body: JSON.stringify({ progress, isClaimed }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    queryClient.invalidateQueries({ queryKey: ['user', userId], exact: false });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['user', userId, 'quests', 'daily', 'update'],
    mutationFn: updateUserDailyQuests,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

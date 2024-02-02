import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Quest } from '@mhgo/types';

import { fetcher, removeCdnUrl } from '../..';
import { API_URL } from '../../env';

/*******************************
 ******* QUESTS - DAILY! *******
 *******************************/

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

// TODO Create quest
export const useAdminCreateQuestApi = () => {
  const queryClient = useQueryClient();

  const adminCreateQuest = async (variables: Quest): Promise<void> => {
    const fixedQuest = {
      ...variables,
      img: removeCdnUrl(variables.img),
    };
    const response = await fetcher(`${API_URL}/admin/quests/daily/create`, {
      method: 'POST',
      body: JSON.stringify(fixedQuest),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({
      queryKey: ['admin', 'quests', 'daily', 'all'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'quest', 'daily', 'create'],
    mutationFn: adminCreateQuest,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// TODO Update quest
export const useAdminUpdateQuestApi = () => {
  const queryClient = useQueryClient();

  const adminUpdateQuest = async (variables: Quest): Promise<void> => {
    const { id, ...questProperties } = variables;
    const fixedQuestProperties = {
      ...questProperties,
      img: removeCdnUrl(questProperties.img),
    };
    const response = await fetcher(
      `${API_URL}/admin/quests/daily/quest/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(fixedQuestProperties),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200 && response.status !== 201)
      throw new Error((await response.json()).error ?? 'Did not work!');
    queryClient.invalidateQueries({
      queryKey: ['admin', 'quests', 'daily', 'all'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'quests', 'daily', 'update'],
    mutationFn: adminUpdateQuest,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

// TODO Delete quest
export const useAdminDeleteQuestMarkerApi = () => {
  const queryClient = useQueryClient();

  const adminDeleteQuestMarker = async (variables: {
    questId: string;
  }): Promise<void> => {
    const response = await fetcher(
      `${API_URL}/admin/quests/daily/quest/${variables.questId}`,
      { method: 'DELETE' },
    );

    if (response.status !== 200)
      throw new Error((await response.json()).error ?? 'Did not work!');

    queryClient.invalidateQueries({
      queryKey: ['admin', 'quests', 'daily', 'all'],
    });
  };

  const { mutate, error, status, isPending, isSuccess, isError } = useMutation({
    mutationKey: ['admin', 'quests', 'daily', 'delete'],
    mutationFn: adminDeleteQuestMarker,
  });

  return { mutate, error, status, isPending, isSuccess, isError };
};

/*******************************
 ******* QUESTS - STORY! *******
 *******************************/

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

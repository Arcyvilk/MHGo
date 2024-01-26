import {
  useQuestsDailyApi,
  useUserQuestsDailyApi,
  useQuestsStoryApi,
  useUserQuestsStoryApi,
} from '@mhgo/front';
import { Quest } from '@mhgo/types';

import { useUser } from '../hooks/useUser';

export const useQuestsStory = (showClaimed: boolean = false) => {
  const { userId, userLevel } = useUser();
  const { data: questsStory, isFetched: isQuestsFetched } = useQuestsStoryApi();
  const { data: userQuestsStory, isFetched: isUserQuestsFetched } =
    useUserQuestsStoryApi(userId);

  const userQuestsWithDetails = questsStory
    ?.filter(quest => (quest.levelRequirement ?? 0) <= userLevel)
    .map(quest => {
      const userQuest = userQuestsStory?.find(q => q.questId === quest.id) ?? {
        progress: 0,
        obtainDate: null,
        isClaimed: false,
      };
      return {
        ...quest,
        ...userQuest,
      } as Quest & { progress: number; isClaimed: boolean };
    })
    .filter(Boolean)
    .sort((a, b) => b.progress - a.progress) as (Quest & {
    progress: number;
    dailyDate: Date;
    isClaimed: boolean;
  })[];

  const sortedByClaimedQuests = [
    ...userQuestsWithDetails.filter(q => !q.isClaimed),
    ...(showClaimed ? userQuestsWithDetails.filter(q => q.isClaimed) : []),
  ];

  return {
    userQuestsWithDetails: sortedByClaimedQuests,
    isFetched: isQuestsFetched && isUserQuestsFetched,
  };
};

export const useQuestsDaily = (showClaimed: boolean) => {
  const { userId } = useUser();
  const { data: questsDaily } = useQuestsDailyApi();
  const { data: userQuestsDaily } = useUserQuestsDailyApi(userId);

  const userQuestsWithDetails = (userQuestsDaily?.daily ?? [])
    .map(userQuest => {
      const quest = questsDaily?.find(q => q.id === userQuest.id);
      if (!quest) return null;
      return {
        ...quest,
        ...userQuest,
      } as Quest & { progress: number };
    })
    .filter(Boolean) as (Quest & {
    progress: number;
    dailyDate: Date;
    isClaimed: boolean;
  })[];

  const sortedByClaimedQuests = [
    ...userQuestsWithDetails.filter(q => !q.isClaimed),
    ...(showClaimed ? userQuestsWithDetails.filter(q => q.isClaimed) : []),
  ];

  return {
    userQuestsWithDetails: sortedByClaimedQuests,
    dailyDate: userQuestsDaily?.dailyDate,
  };
};

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useQuestsDailyApi,
  useQuestsStoryApi,
  useUserQuestsDailyApi,
  useUserQuestsStoryApi,
} from '@mhgo/front';
import { Quest } from '@mhgo/types';

import { useUser } from '../../hooks/useUser';
import { QuestTile } from './QuestTile';

import s from './QuestView.module.scss';

dayjs.extend(relativeTime);

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestStoryView = () => {
  const { userQuestsWithDetails } = useQuestsStory();

  return (
    <div className={s.questView__list}>
      {userQuestsWithDetails.map(quest => (
        <QuestTile quest={quest} />
      ))}
    </div>
  );
};

const useQuestsStory = () => {
  const { userId } = useUser();
  const { data: questsStory } = useQuestsStoryApi();
  const { data: userQuestsStory } = useUserQuestsStoryApi(userId);

  const userQuestsWithDetails = questsStory
    .map(quest => {
      const userQuest = userQuestsStory?.find(q => q.questId === quest.id) ?? {
        progress: 0,
        obtainDate: null,
      };
      return {
        ...quest,
        ...userQuest,
      } as Quest & { progress: number };
    })
    .filter(Boolean) as (Quest & { progress: number; dailyDate: Date })[];

  return { userQuestsWithDetails };
};

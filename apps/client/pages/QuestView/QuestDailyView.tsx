import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useQuestsDailyApi, useUserQuestsDailyApi } from '@mhgo/front';
import { Quest } from '@mhgo/types';

import { useUser } from '../../hooks/useUser';
import { QuestTile } from './QuestTile';

import s from './QuestView.module.scss';

dayjs.extend(relativeTime);

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestDailyView = () => {
  const { userQuestsWithDetails, dailyDate } = useQuestsDaily();

  return (
    <>
      <div className={s.dailyView__header}>
        <div className={s.dailyView__title}>Daily Quests</div>
        <div className={s.dailyView__remaining}>
          Remaining: {dayjs(new Date()).to(dailyDate, true)}
        </div>
      </div>
      <div className={s.questView__list}>
        {userQuestsWithDetails.map(daily => (
          <QuestTile quest={daily} />
        ))}
      </div>
    </>
  );
};

const useQuestsDaily = () => {
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
    .filter(Boolean) as (Quest & { progress: number; dailyDate: Date })[];

  return { userQuestsWithDetails, dailyDate: userQuestsDaily?.dailyDate };
};

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useQuestsDaily } from '../../hooks/useQuests';
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
          <QuestTile
            key={`quest-daily-${daily.id}`}
            quest={daily}
            type="daily"
          />
        ))}
      </div>
    </>
  );
};

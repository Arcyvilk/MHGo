import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { LSKeys, Switch, useLocalStorage } from '@mhgo/front';
import { YourCompanion } from '../../containers';
import { useQuestsDaily } from '../../hooks/useQuests';
import { useCompanion } from '../../hooks/useCompanion';
import { QuestTile } from './QuestTile';

import s from './QuestView.module.scss';

dayjs.extend(relativeTime);

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestDailyView = () => {
  const { companion } = useCompanion();
  const [questFilters, setQuestFilters] = useLocalStorage(
    LSKeys.MHGO_QUEST_FILTERS,
    { showClaimed: true },
  );
  const { userQuestsWithDetails, dailyDate } = useQuestsDaily(
    questFilters?.showClaimed ?? true,
  );

  return (
    <>
      <div className={s.dailyView__header}>
        <div className={s.dailyView__title}>Daily Quests</div>
        <div className={s.dailyView__remaining}>
          Remaining: {dayjs(new Date()).to(dailyDate, true)}
        </div>
      </div>
      <div className={s.questView__list}>
        <Switch
          label="Show completed"
          checked={questFilters.showClaimed}
          setChecked={checked => setQuestFilters({ showClaimed: checked })}
        />
        {userQuestsWithDetails.length ? (
          userQuestsWithDetails.map(daily => (
            <QuestTile
              key={`quest-daily-${daily.id}`}
              quest={daily}
              type="daily"
            />
          ))
        ) : (
          <div className={s.questView__empty}>
            <YourCompanion
              companion={companion}
              isSpeechBubbleOpen
              companionTip="You completed all of your daily quests! Come around tomorrow :3"
              isSmol
            />
          </div>
        )}
      </div>
    </>
  );
};

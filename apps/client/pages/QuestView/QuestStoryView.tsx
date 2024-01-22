import { LSKeys, Switch, useLocalStorage } from '@mhgo/front';
import { useQuestsStory } from '../../hooks/useQuests';
import { useCompanion } from '../../hooks/useCompanion';
import { YourCompanion } from '../../containers';
import { QuestTile } from './QuestTile';

import s from './QuestView.module.scss';

export const QuestStoryView = () => {
  const { companion } = useCompanion();
  const [questFilters, setQuestFilters] = useLocalStorage(
    LSKeys.MHGO_QUEST_FILTERS,
    { showClaimed: true },
  );
  const { userQuestsWithDetails } = useQuestsStory(
    questFilters?.showClaimed ?? true,
  );

  return (
    <div className={s.questView__list}>
      <Switch
        label="Show completed"
        checked={questFilters.showClaimed}
        setChecked={checked => setQuestFilters({ showClaimed: checked })}
      />
      {userQuestsWithDetails.length ? (
        userQuestsWithDetails.map(quest => (
          <QuestTile
            key={`quest-story-${quest.id}`}
            quest={quest}
            type="story"
          />
        ))
      ) : (
        <YourCompanion
          companion={companion}
          isSpeechBubbleOpen
          companionTip="You completed all of your quests! Stay tuned - something new might appear here soon :3"
          isSmol
        />
      )}
    </div>
  );
};

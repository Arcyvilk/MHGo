import { useQuestsStory } from '../../hooks/useQuests';
import { QuestTile } from './QuestTile';

import s from './QuestView.module.scss';

export const QuestStoryView = () => {
  const { userQuestsWithDetails } = useQuestsStory();

  // TODO make story quests redeem themselves, like achievements

  return (
    <div className={s.questView__list}>
      {userQuestsWithDetails.map(quest => (
        <QuestTile quest={quest} type="story" />
      ))}
    </div>
  );
};

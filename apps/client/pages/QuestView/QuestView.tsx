import { useState } from 'react';
import { CloseButton, Loader, QueryBoundary, Tabs } from '@mhgo/front';

import { QuestDailyView } from './QuestDailyView';
import { QuestStoryView } from './QuestStoryView';

import s from './QuestView.module.scss';

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestView = () => {
  const [activeTab, setActiveTab] = useState(TABS.STORY);

  return (
    <div className={s.questView}>
      <div className={s.questView__header}>
        <Tabs
          allTabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {activeTab === TABS.STORY && (
        <QueryBoundary fallback={<Loader />}>
          <QuestStoryView />
        </QueryBoundary>
      )}
      {activeTab === TABS.DAILY && (
        <QueryBoundary fallback={<Loader />}>
          <QuestDailyView />
        </QueryBoundary>
      )}
      <CloseButton />
    </div>
  );
};

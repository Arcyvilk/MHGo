import { useState } from 'react';
import { CloseButton, Tabs } from '../../components';

import s from './QuestView.module.scss';

export const TABS = {
  STORY: 'Story',
  SPECIAL: 'Special',
};

export const QuestView = () => {
  const [activeTab, setActiveTab] = useState(TABS.STORY);

  return (
    <div className={s.questView}>
      <div className={s.questView__wrapper}>
        <Tabs
          allTabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        QuestView
      </div>
      <CloseButton />
    </div>
  );
};

import { useState } from 'react';
import { CloseButton } from '../../components/CloseButton';
import { TABS, Tabs } from './Tabs';

import s from './QuestView.module.scss';

export const QuestView = () => {
  const [activeTab, setActiveTab] = useState(TABS.STORY);

  return (
    <div className={s.questView}>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      QuestView
      <CloseButton />
    </div>
  );
};

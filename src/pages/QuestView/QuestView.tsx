import { useState } from 'react';

import { CloseButton } from '../../components';
import { TABS, Tabs } from './Tabs';

import s from './QuestView.module.scss';

export const QuestView = () => {
  const [activeTab, setActiveTab] = useState(TABS.STORY);

  return (
    <div className={s.questView}>
      <div className={s.questView__wrapper}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        QuestView
      </div>
      <CloseButton />
    </div>
  );
};

import { useState } from 'react';
import { CloseButton } from '@mhgo/front';

import s from './QuestView.module.scss';

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestStoryView = () => {
  return (
    <div className={s.questView}>
      <div className={s.questView__wrapper}>Story</div>
      <CloseButton />
    </div>
  );
};

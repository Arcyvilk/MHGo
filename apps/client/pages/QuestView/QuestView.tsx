import {
  CloseButton,
  Loader,
  QueryBoundary,
  Skeleton,
  Tabs,
} from '@mhgo/front';

import { QuestDailyView } from './QuestDailyView';
import { QuestStoryView } from './QuestStoryView';

import s from './QuestView.module.scss';

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestView = () => {
  return (
    <div className={s.questView}>
      <Tabs
        allTabs={TABS}
        defaultTab={TABS.STORY}
        headerStyle={{ margin: '16px 16px 0 16px' }}
        content={[
          {
            tab: TABS.STORY,
            component: (
              <QueryBoundary
                key={`tab-${TABS.STORY}`}
                fallback={<SkeletonQuest />}>
                <QuestStoryView />
              </QueryBoundary>
            ),
          },
          {
            tab: TABS.DAILY,
            component: (
              <QueryBoundary
                key={`tab-${TABS.DAILY}`}
                fallback={<SkeletonQuest />}>
                <QuestDailyView />
              </QueryBoundary>
            ),
          },
        ]}
      />

      <CloseButton backToHome />
    </div>
  );
};

const SkeletonQuest = () => {
  return (
    <div className={s.questView__list}>
      <Skeleton width="100%" height="12rem" />
      <Skeleton width="100%" height="12rem" />
      <Skeleton width="100%" height="12rem" />
    </div>
  );
};

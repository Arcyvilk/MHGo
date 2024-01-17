import { Link, useSearchParams } from 'react-router-dom';
import { SoundSE, modifiers, useSounds } from '@mhgo/front';
import s from './Tabs.module.scss';
import { useMemo } from 'react';

type TabsProps<T extends string> = {
  allTabs: Record<T, string>;
  defaultTab: T;
  content: { tab: T; component: JSX.Element }[];
  headerStyle?: React.CSSProperties;
};
export const Tabs = <T extends string>({
  allTabs,
  defaultTab,
  content,
  headerStyle = {},
}: TabsProps<T>) => {
  const TAB_KEY = 'tab';
  const { playSound } = useSounds(undefined);
  const [searchParams] = useSearchParams();

  const activeTab = useMemo(() => {
    return (searchParams.get(TAB_KEY) ?? defaultTab) as T;
  }, [searchParams]);

  return (
    <>
      <div className={s.tabs} style={headerStyle}>
        {Object.entries(allTabs).map(tab => {
          const [tabKey, tabValue] = tab as [T, string];
          return (
            <Link
              className={modifiers(s, 'tabs__tab', 'router_link', {
                isActive: activeTab === tabValue,
              })}
              to={`?tab=${tabValue}`}
              onClick={() => playSound(SoundSE.CLICK)}
              preventScrollReset={true}
              key={tabKey}>
              {tabValue}
            </Link>
          );
        })}
      </div>
      {content.map(tabContent => {
        if (tabContent.tab === activeTab) return tabContent.component;
      })}
    </>
  );
};

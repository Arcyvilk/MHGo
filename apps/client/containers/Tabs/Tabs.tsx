import { modifiers } from '@mhgo/components';
import s from './Tabs.module.scss';

type TabsProps<T> = {
  allTabs: T;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
};
export const Tabs = <T extends Record<string, string>>({
  allTabs,
  activeTab,
  setActiveTab,
}: TabsProps<T>) => {
  const onTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <div className={s.tabs}>
      {Object.entries(allTabs).map(tab => {
        const [tabKey, tabValue] = tab;
        return (
          <button
            className={modifiers(s, 'tabs__tab', {
              isActive: activeTab === tabValue,
            })}
            onClick={() => onTabClick(tabValue)}
            key={tabKey}>
            {tabValue}
          </button>
        );
      })}
    </div>
  );
};

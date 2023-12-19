import { modifiers } from '../../utils/modifiers';
import s from './Tabs.module.scss';

export enum TABS {
  STORY = 'Story',
  SPECIAL = 'Special',
}

type TabsProps = {
  activeTab: TABS;
  setActiveTab: (activeTab: TABS) => void;
};
export const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  const onTabClick = (tab: TABS) => {
    setActiveTab(tab);
  };
  return (
    <div className={s.tabs}>
      <button
        className={modifiers(s, 'tabs__tab', {
          isActive: activeTab === TABS.STORY,
        })}
        onClick={() => onTabClick(TABS.STORY)}>
        {TABS.STORY}
      </button>
      <button
        className={modifiers(s, 'tabs__tab', {
          isActive: activeTab === TABS.SPECIAL,
        })}
        onClick={() => onTabClick(TABS.SPECIAL)}>
        {TABS.SPECIAL}
      </button>
    </div>
  );
};

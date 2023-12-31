import { modifiers } from '@mhgo/front';
import s from './Tabs.module.scss';

export enum TABS {
  MATERIALS = 'Materials',
  ITEMS = 'Items',
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
          isActive: activeTab === TABS.MATERIALS,
        })}
        onClick={() => onTabClick(TABS.MATERIALS)}>
        {TABS.MATERIALS}
      </button>
      <button
        className={modifiers(s, 'tabs__tab', {
          isActive: activeTab === TABS.ITEMS,
        })}
        onClick={() => onTabClick(TABS.ITEMS)}>
        {TABS.ITEMS}
      </button>
    </div>
  );
};

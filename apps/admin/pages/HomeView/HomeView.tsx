import { useState } from 'react';
import { Tabs } from '@mhgo/front';

import { MapView, MonstersView, ItemsView, MaterialsView } from '..';

import s from './HomeView.module.scss';

export const TABS = {
  MAP: 'Map',
  MONSTERS: 'Monsters',
  ITEMS: 'Items',
  MATERIALS: 'Materials',
};
export const HomeView = () => {
  const [activeTab, setActiveTab] = useState(TABS.MAP);

  return (
    <div className={s.homeView}>
      <Tabs allTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS.MAP && <MapView />}
      {activeTab === TABS.MONSTERS && <MonstersView />}
      {activeTab === TABS.ITEMS && <ItemsView />}
      {activeTab === TABS.MATERIALS && <MaterialsView />}
    </div>
  );
};

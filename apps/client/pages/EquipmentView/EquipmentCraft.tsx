import { useState } from 'react';
import { ItemType } from '@mhgo/types';

import { Loader, QueryBoundary } from '@mhgo/front';
import { Tabs } from '@mhgo/front';
import { EquipmentDropdown } from './EquipmentDropdown';
import { useItems } from '../../hooks/useItems';

import s from './EquipmentCraft.module.scss';

export const TABS = {
  QUEST: 'Quest',
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
  UTILITY: 'Utility',
};

// TODO this should show not only craftable items,
// but also ones that user has and the amount of those
export const EquipmentCraft = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [activeTab, setActiveTab] = useState(TABS.QUEST);

  return (
    <div className={s.equipmentView__craft}>
      <Tabs allTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS.QUEST && <EquipmentPieces itemType="quest" />}
      {activeTab === TABS.WEAPONS && <EquipmentPieces itemType="weapon" />}
      {activeTab === TABS.ARMOR && <EquipmentPieces itemType="armor" />}
      {activeTab === TABS.UTILITY && <EquipmentPieces itemType="other" />}
    </div>
  );
};

type EquipmentPiecesProps = {
  itemType: ItemType;
};
const EquipmentPieces = ({ itemType }: EquipmentPiecesProps) => {
  const { items } = useItems();

  return (
    <div className={s.equipmentView__items}>
      {items
        .filter(item => item.type === itemType)
        .map(item => (
          <EquipmentDropdown item={item} />
        ))}
    </div>
  );
};

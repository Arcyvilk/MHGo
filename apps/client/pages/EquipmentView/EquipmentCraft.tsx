import { useState } from 'react';
import { ItemType } from '@mhgo/types';
import { Loader, Tabs, QueryBoundary, Switch } from '@mhgo/front';

import { ItemContextMenu } from '../../containers';
import { useUserEquipment } from '../../hooks/useUserEquipment';

import s from './EquipmentCraft.module.scss';

export const TABS = {
  QUEST: 'Quest',
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
  UTILITY: 'Utility',
};

export const EquipmentCraft = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [activeTab, setActiveTab] = useState(TABS.QUEST);
  const [showOwned, setShowOwned] = useState(true);
  const [showNotOwned, setShowNotOwned] = useState(true);

  return (
    <div className={s.equipmentView__craft}>
      <div className={s.equipmentView__actions}>
        <Switch
          label="Show owned"
          checked={showOwned}
          setChecked={setShowOwned}
        />
        <Switch
          label="Show not owned"
          checked={showNotOwned}
          setChecked={setShowNotOwned}
        />
      </div>
      <Tabs allTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS.QUEST && (
        <EquipmentPieces
          key="tab_quest"
          itemType="quest"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
        />
      )}
      {activeTab === TABS.WEAPONS && (
        <EquipmentPieces
          key="tab_weapon"
          itemType="weapon"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
        />
      )}
      {activeTab === TABS.ARMOR && (
        <EquipmentPieces
          key="tab_armor"
          itemType="armor"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
        />
      )}
      {activeTab === TABS.UTILITY && (
        <EquipmentPieces
          key="tab_other"
          itemType="other"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
        />
      )}
    </div>
  );
};

type EquipmentPiecesProps = {
  itemType: ItemType;
  showOwned: boolean;
  showNotOwned: boolean;
};
const EquipmentPieces = ({
  itemType,
  showOwned,
  showNotOwned,
}: EquipmentPiecesProps) => {
  const items = useUserEquipment();

  return (
    <div className={s.equipmentView__items}>
      {items
        .filter(item => {
          const filterByType = item.type === itemType;
          const filterByOwned = item.isOwned !== true;
          const filterByNotOwned = item.isOwned !== false;

          // This filter by ownership is convoluted and hacky with all those double negations
          // but tbh im too tired to think of anything smarter
          return (
            filterByType &&
            (!showOwned ? filterByOwned : true) &&
            (!showNotOwned ? filterByNotOwned : true)
          );
        })
        .map(item => (
          <ItemContextMenu
            key={`context_menu_${item.id}`}
            item={item}
            isItemOwned={item.isOwned}
          />
        ))}
    </div>
  );
};

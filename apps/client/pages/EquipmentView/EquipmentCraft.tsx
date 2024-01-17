import { useMemo, useState } from 'react';
import { ItemType } from '@mhgo/types';
import {
  Loader,
  Tabs,
  QueryBoundary,
  Switch,
  useContextualRouting,
} from '@mhgo/front';

import { ItemContextMenu } from '../../containers';
import { useUserEquipment } from '../../hooks/useUserEquipment';
import { useUser } from '../../hooks/useUser';

import s from './EquipmentCraft.module.scss';

export const TABS = {
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
  UTILITY: 'Utility',
  QUEST: 'Quest',
};

export const EquipmentCraft = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [showOwned, setShowOwned] = useState(true);
  const [showNotOwned, setShowNotOwned] = useState(true);
  const [categoryView, setCategoryView] = useState(false);

  const { navigateToRoute, route: activeTab } = useContextualRouting<string>({
    key: 'tab',
    value: TABS.WEAPONS,
  });

  const handleTabChange = (newTab: string) => {
    navigateToRoute({ tab: newTab });
  };

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
        <Switch
          label="Category view"
          checked={categoryView}
          setChecked={setCategoryView}
        />
      </div>
      <Tabs
        allTabs={TABS}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      {activeTab === TABS.WEAPONS && (
        <EquipmentPieces
          key="tab_weapon"
          itemType="weapon"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
          categoryView={categoryView}
        />
      )}
      {activeTab === TABS.ARMOR && (
        <EquipmentPieces
          key="tab_armor"
          itemType="armor"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
          categoryView={categoryView}
        />
      )}
      {activeTab === TABS.UTILITY && (
        <EquipmentPieces
          key="tab_other"
          itemType="other"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
          categoryView={categoryView}
        />
      )}
      {activeTab === TABS.QUEST && (
        <EquipmentPieces
          key="tab_quest"
          itemType="quest"
          showOwned={showOwned}
          showNotOwned={showNotOwned}
          categoryView={categoryView}
        />
      )}
    </div>
  );
};

type EquipmentPiecesProps = {
  itemType: ItemType;
  showOwned: boolean;
  showNotOwned: boolean;
  categoryView: boolean;
};
const EquipmentPieces = ({
  itemType,
  showOwned,
  showNotOwned,
  categoryView,
}: EquipmentPiecesProps) => {
  const { userLevel } = useUser();
  const items = useUserEquipment();

  const filtereditems = useMemo(() => {
    return items.filter(item => {
      const filterByType = item.type === itemType;
      const filterByOwned = item.isOwned !== true;
      const filterByNotOwned = item.isOwned !== false;

      // This filter by ownership is convoluted and hacky with all those double negations
      // but tbh im too tired to think of anything smarter
      return (
        filterByType &&
        (!showOwned ? filterByOwned : true) &&
        (!showNotOwned ? filterByNotOwned : true) &&
        (item.levelRequirement ?? 0) <= userLevel
      );
    });
  }, [items, itemType, showOwned, showNotOwned, userLevel]);

  if (categoryView) {
    const categories = new Set(filtereditems.map(item => item.category));
    return Array.from(categories).map(category => (
      <>
        <div className={s.equipmentView__categoryTitle}>
          {category ?? 'Other'}
        </div>
        <div className={s.equipmentView__items}>
          {filtereditems
            .filter(item => item.category === category)
            .map(item => (
              <ItemContextMenu
                key={`context_menu_${item.id}`}
                item={item}
                isItemOwned={item.isOwned}
              />
            ))}
        </div>
      </>
    ));
  } else
    return (
      <div className={s.equipmentView__items}>
        {filtereditems.map(item => (
          <ItemContextMenu
            key={`context_menu_${item.id}`}
            item={item}
            isItemOwned={item.isOwned}
          />
        ))}
      </div>
    );
};

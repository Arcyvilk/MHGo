import { useMemo, Fragment } from 'react';
import { ItemType } from '@mhgo/types';
import {
  Tabs,
  QueryBoundary,
  Switch,
  useLocalStorage,
  LSKeys,
  Item,
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

export const EquipmentCraft = () => {
  const [equipmentFilters, setEquipmentFilters] = useLocalStorage(
    LSKeys.MHGO_EQUIPMENT_FILTERS,
    { showOwned: true, showNotOwned: true, categoryView: false },
  );

  return (
    <div className={s.equipmentView__craft}>
      <div className={s.equipmentView__actions}>
        <Switch
          label="Show owned"
          checked={equipmentFilters.showOwned}
          setChecked={showOwned => {
            setEquipmentFilters({
              ...equipmentFilters,
              showOwned,
            });
          }}
        />
        <Switch
          label="Show not owned"
          checked={equipmentFilters.showNotOwned}
          setChecked={showNotOwned => {
            setEquipmentFilters({
              ...equipmentFilters,
              showNotOwned,
            });
          }}
        />
        <Switch
          label="Category view"
          checked={equipmentFilters.categoryView}
          setChecked={categoryView => {
            setEquipmentFilters({
              ...equipmentFilters,
              categoryView,
            });
          }}
        />
      </div>
      <Tabs
        allTabs={TABS}
        defaultTab={TABS.WEAPONS}
        content={[
          {
            tab: TABS.WEAPONS,
            component: (
              <EquipmentPieces
                key="tab_weapon"
                itemType="weapon"
                {...equipmentFilters}
              />
            ),
          },
          {
            tab: TABS.ARMOR,
            component: (
              <EquipmentPieces
                key="tab_armor"
                itemType="armor"
                {...equipmentFilters}
              />
            ),
          },
          {
            tab: TABS.UTILITY,
            component: (
              <EquipmentPieces
                key="tab_other"
                itemType="other"
                {...equipmentFilters}
              />
            ),
          },
          {
            tab: TABS.QUEST,
            component: (
              <EquipmentPieces
                key="tab_quest"
                itemType="quest"
                {...equipmentFilters}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

type EquipmentPiecesProps = {
  itemType: ItemType;
  showOwned: boolean;
  showNotOwned: boolean;
  categoryView: boolean;
};
const EquipmentPieces = (props: EquipmentPiecesProps) => (
  <QueryBoundary fallback={<SkeletonEquipmentPieces />}>
    <Load {...props} />
  </QueryBoundary>
);

const SkeletonEquipmentPieces = () => (
  <div className={s.equipmentView__items}>
    <Item.Skeleton />
    <Item.Skeleton />
    <Item.Skeleton />
    <Item.Skeleton />
    <Item.Skeleton />
  </div>
);

const Load = ({
  itemType,
  showOwned,
  showNotOwned,
  categoryView,
}: EquipmentPiecesProps) => {
  const { userLevel } = useUser();
  const items = useUserEquipment();

  const filteredItems = useMemo(() => {
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
    const categories = [
      ...new Set(filteredItems.map(item => item.category).filter(Boolean)),
      '',
    ];
    return Array.from(categories).map(category => (
      <Fragment key={`category-${category}`}>
        <div className={s.equipmentView__categoryTitle}>
          {category ? category : 'Other'}
        </div>
        <div className={s.equipmentView__items}>
          {filteredItems
            .filter(item => item.category === category)
            .map(item => (
              <ItemContextMenu
                key={`context_menu_${item.id}`}
                item={item}
                isItemOwned={item.isOwned}
                isItemEquipped={item.isEquipped}
                canBeCrafted={item.canBeCrafted}
              />
            ))}
        </div>
      </Fragment>
    ));
  } else
    return (
      <div className={s.equipmentView__items}>
        {filteredItems.map(item => (
          <ItemContextMenu
            key={`context_menu_${item.id}`}
            item={item}
            isItemOwned={item.isOwned}
            canBeCrafted={item.canBeCrafted}
          />
        ))}
      </div>
    );
};

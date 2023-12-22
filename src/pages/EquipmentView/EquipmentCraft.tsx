import { useState } from 'react';
import { toast } from 'react-toastify';
import { Tabs } from '../../components';
import { Item } from '../ItemBoxView/Item';

import s from './EquipmentCraft.module.scss';

import { items } from '../../_mock/items';

export const TABS = {
  QUEST: 'Quest',
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
};

export const EquipmentCraft = () => {
  const [activeTab, setActiveTab] = useState(TABS.QUEST);

  return (
    <div className={s.equipmentView__craft}>
      <Tabs allTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS.QUEST && <QuestCraft />}
      {activeTab === TABS.WEAPONS && <WeaponsCraft />}
      {activeTab === TABS.ARMOR && <ArmorCraft />}
    </div>
  );
};

const QuestCraft = () => {
  const { craftableItems, onCraft } = useCraftableItems();
  return (
    <div className={s.equipmentView__items}>
      {craftableItems.map(item => (
        <Item {...item} onClick={() => onCraft(item.id)} />
      ))}
    </div>
  );
};

const WeaponsCraft = () => {
  const { craftableItems, onCraft } = useCraftableItems();
  return (
    <div className={s.equipmentView__items}>
      {craftableItems.map(item => (
        <Item {...item} onClick={() => onCraft(item.id)} />
      ))}
    </div>
  );
};

const ArmorCraft = () => {
  const { craftableItems, onCraft } = useCraftableItems();
  return (
    <div className={s.equipmentView__items}>
      {craftableItems.map(item => (
        <Item {...item} onClick={() => onCraft(item.id)} />
      ))}
    </div>
  );
};

const useCraftableItems = () => {
  const craftableItems = items
    .filter(item => item.craftable)
    .map(item => ({
      ...item,
      purchasable: false, // We don't want to purchase items in craft view
    }));

  const onCraft = (itemId: string) => {
    if (confirm(`Do you want to craft 1x ${itemId}?`))
      toast.info(`Crafting item ${itemId} not implemented yet!`);
  };

  return { craftableItems, onCraft };
};

import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ItemType } from '@mhgo/types';

import { Button, Loader, Modal, QueryBoundary } from '../../components';
import { Item, Tabs } from '../../containers';
import { useItems } from '../../hooks/useItems';
import { useMaterials } from '../../hooks/useMaterials';

import s from './EquipmentCraft.module.scss';

import { items } from '../../_mock/items';

export const TABS = {
  QUEST: 'Quest',
  WEAPONS: 'Weapons',
  ARMOR: 'Armor',
};

export const EquipmentCraft = () => (
  <QueryBoundary fallback={<Loader />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
  const [activeTab, setActiveTab] = useState(TABS.QUEST);
  const [activeItem, setActiveItem] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCraftClick = (itemId: string) => {
    setActiveItem(itemId);
    setIsModalOpen(true);
  };

  return (
    <div className={s.equipmentView__craft}>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onClose={() => {}}>
        <CraftConfirmation
          itemId={activeItem}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
      <Tabs allTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS.QUEST && <QuestCraft onCraft={onCraftClick} />}
      {activeTab === TABS.WEAPONS && <WeaponsCraft onCraft={onCraftClick} />}
      {activeTab === TABS.ARMOR && <ArmorCraft onCraft={onCraftClick} />}
    </div>
  );
};

const QuestCraft = ({ onCraft }: { onCraft: (itemId: string) => void }) => {
  const { craftableItems } = useCraftableItems();
  return (
    <div className={s.equipmentView__items}>
      {craftableItems
        .filter(item => item.type === ItemType.QUEST)
        .map(item => (
          <div className={s.equipmentView__itemWrapper} key={item.id}>
            <Item data={item} onClick={() => onCraft(item.id)} />
          </div>
        ))}
    </div>
  );
};

const WeaponsCraft = ({ onCraft }: { onCraft: (itemId: string) => void }) => {
  const { craftableItems } = useCraftableItems();
  return (
    <div className={s.equipmentView__items}>
      {craftableItems
        .filter(item => item.type === ItemType.WEAPON)
        .map(item => (
          <div className={s.equipmentView__itemWrapper} key={item.id}>
            <Item data={item} onClick={() => onCraft(item.id)} />
          </div>
        ))}
    </div>
  );
};

const ArmorCraft = ({ onCraft }: { onCraft: (itemId: string) => void }) => {
  const { craftableItems } = useCraftableItems();
  return (
    <div className={s.equipmentView__items}>
      {craftableItems
        .filter(item => item.type === ItemType.ARMOR)
        .map(item => (
          <div className={s.equipmentView__itemWrapper} key={item.id}>
            <Item data={item} onClick={() => onCraft(item.id)} />
          </div>
        ))}
    </div>
  );
};

type CraftConfirmationProps = {
  itemId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};
const CraftConfirmation = ({
  itemId,
  setIsModalOpen,
}: CraftConfirmationProps) => {
  const { getItem } = useItems();
  const { onCraft, getItemCraftingList } = useCraftableItems();
  const item = useMemo(() => getItem(itemId), [itemId]);
  const matsToCraft = useMemo(() => getItemCraftingList(itemId), [itemId]);

  const onYes = () => {
    setIsModalOpen(false);
    onCraft(itemId);
  };
  const onNo = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={s.craftConfirmation}>
      <h2 className={s.craftConfirmation__prompt}>
        Crafting {item?.name ?? 'item'}...
      </h2>
      <p className={s.craftConfirmation__text}>
        Crafting <span style={{ fontWeight: 800 }}>{item?.name ?? 'this'}</span>{' '}
        will consume the following materials:
      </p>
      <div className={s.craftConfirmation__materials}>
        {matsToCraft.map(mat => (
          // @ts-ignore // TODO fix it!
          <Item {...mat} simple key={item.id} />
        ))}
      </div>
      <div className={s.craftConfirmation__buttons}>
        <Button
          label="Cancel"
          onClick={onNo}
          simple
          variant={Button.Variant.DANGER}
        />
        <Button label="Craft" onClick={onYes} simple />
      </div>
    </div>
  );
};

const useCraftableItems = () => {
  const { materials } = useMaterials();

  const craftableItems = items
    .filter(item => item.craftable)
    .map(item => ({
      ...item,
      purchasable: false, // We don't want to purchase items in craft view
    }));

  const onCraft = (_itemId: string) => {
    toast.info(`Crafting not implemented yet!`);
  };

  const getItemCraftingList = (itemId: string) => {
    const itemToCraft = items.find(item => item.id === itemId);
    if (!itemToCraft?.craftable) return [];
    const materialMats = itemToCraft.craftList
      .filter(item => item.type === 'material')
      .map(material => ({
        ...materials.find(m => m.id === material.id),
        amount: material.amount,
      }))
      .filter(Boolean);
    const itemMats = itemToCraft.craftList
      .filter(item => item.type === 'item')
      .map(item => ({
        ...items.find(i => i.id === item.id),
        amount: item.amount,
      }))
      .filter(Boolean);

    return [...materialMats, ...itemMats];
  };

  return { craftableItems, onCraft, getItemCraftingList };
};

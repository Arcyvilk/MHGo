import { useState } from 'react';
import { ItemType, Item as TItem } from '@mhgo/types';

import {
  Button,
  Dropdown,
  Loader,
  Modal,
  QueryBoundary,
} from '../../components';
import { Item, Tabs } from '../../containers';
import { useCraftableItems } from '../../hooks/useCraftableItems';
import { CraftConfirmation } from './Craft/CraftConfirmation';

import s from './EquipmentCraft.module.scss';
import { toast } from 'react-toastify';

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
  const onUseClick = (itemId: string) => {
    toast.info(`Using items not supported yet! [${itemId}]`);
  };
  const onEquipClick = (itemId: string) => {
    toast.info(`Equipping items not supported yet! [${itemId}]`);
  };

  return (
    <div className={s.equipmentView__craft}>
      {activeItem && (
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onClose={() => {}}>
          <CraftConfirmation
            itemId={activeItem}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
      <Tabs allTabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS.QUEST && (
        <EquipmentPieces
          onCraft={onCraftClick}
          onUse={onUseClick}
          onEquip={onEquipClick}
          itemType="quest"
        />
      )}
      {activeTab === TABS.WEAPONS && (
        <EquipmentPieces
          onCraft={onCraftClick}
          onUse={onUseClick}
          onEquip={onEquipClick}
          itemType="weapon"
        />
      )}
      {activeTab === TABS.ARMOR && (
        <EquipmentPieces
          onCraft={onCraftClick}
          onUse={onUseClick}
          onEquip={onEquipClick}
          itemType="armor"
        />
      )}
    </div>
  );
};

type EquipmentActions = {
  onCraft: (itemId: string) => void;
  onUse: (itemId: string) => void;
  onEquip: (itemId: string) => void;
};
type EquipmentPiecesProps = EquipmentActions & {
  itemType: ItemType;
};
const EquipmentPieces = ({ itemType, ...actions }: EquipmentPiecesProps) => {
  const { craftableItems } = useCraftableItems();

  return (
    <div className={s.equipmentView__items}>
      {craftableItems
        .filter(item => item.type === itemType)
        .map(item => (
          <div className={s.equipmentView__itemWrapper} key={item.id}>
            <Dropdown content={<EquipmentDropdown item={item} {...actions} />}>
              <Item data={item} />
            </Dropdown>
          </div>
        ))}
    </div>
  );
};

const EquipmentDropdown = ({
  item,
  onCraft,
  onEquip,
  onUse,
}: EquipmentActions & {
  item: TItem;
}) => {
  const onItemCraft = () => {
    if (item.craftable) return onCraft(item.id);
  };
  const onItemEquip = () => {
    if (item.craftable) return onEquip(item.id);
  };
  const onItemUse = () => {
    if (item.craftable) return onUse(item.id);
  };

  return (
    <div className={s.equipmentDropdown}>
      {item.craftable && <Button label="Craft" onClick={onItemCraft} />}
      {item.equippable && <Button label="Equip" onClick={onItemEquip} />}
      {item.usable && <Button label="Use" onClick={onItemUse} />}
    </div>
  );
};

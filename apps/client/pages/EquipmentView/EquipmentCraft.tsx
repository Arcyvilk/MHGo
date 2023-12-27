import { useState } from 'react';
import { toast } from 'react-toastify';
import { ItemType } from '@mhgo/types';

import { Dropdown, Loader, Modal, QueryBoundary } from '../../components';
import { Item, Tabs } from '../../containers';
import { useCraftableItems } from '../../hooks/useCraftableItems';
import { CraftConfirmation } from './Craft/CraftConfirmation';
import { EquipmentDropdown } from './EquipmentDropdown';

import s from './EquipmentCraft.module.scss';

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

type EquipmentPiecesProps = {
  itemType: ItemType;
  onCraft: (itemId: string) => void;
  onUse: (itemId: string) => void;
  onEquip: (itemId: string) => void;
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

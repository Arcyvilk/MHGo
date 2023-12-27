import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Item as TItem, Material } from '@mhgo/types';

import { Button, Loader, Modal, QueryBoundary } from '../../components';
import { Item, Tabs } from '../../containers';
import { useItems } from '../../hooks/useItems';
import { useCraftableItems } from '../../hooks/useCraftableItems';

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
      {activeTab === TABS.QUEST && <QuestCraft onCraft={onCraftClick} />}
      {activeTab === TABS.WEAPONS && <WeaponsCraft onCraft={onCraftClick} />}
      {activeTab === TABS.ARMOR && <ArmorCraft onCraft={onCraftClick} />}
    </div>
  );
};

const QuestCraft = ({ onCraft }: { onCraft: (itemId: string) => void }) => {
  const { craftableItems } = useCraftableItems();
  const onItemClick = (item: TItem) => {
    if (item.craftable) return onCraft(item.id);
  };
  return (
    <div className={s.equipmentView__items}>
      {craftableItems
        .filter(item => item.type === 'quest')
        .map(item => (
          <div className={s.equipmentView__itemWrapper} key={item.id}>
            <Item data={item} onClick={() => onItemClick(item)} />
          </div>
        ))}
    </div>
  );
};

const WeaponsCraft = ({ onCraft }: { onCraft: (itemId: string) => void }) => {
  const { craftableItems } = useCraftableItems();
  const onItemClick = (item: TItem) => {
    if (item.craftable) return onCraft(item.id);
  };
  return (
    <div className={s.equipmentView__items}>
      {craftableItems
        .filter(item => item.type === 'weapon')
        .map(item => (
          <div className={s.equipmentView__itemWrapper} key={item.id}>
            <Item data={item} onClick={() => onItemClick(item)} />
          </div>
        ))}
    </div>
  );
};

const ArmorCraft = ({ onCraft }: { onCraft: (itemId: string) => void }) => {
  const { craftableItems } = useCraftableItems();
  const onItemClick = (item: TItem) => {
    if (item.craftable) return onCraft(item.id);
  };
  return (
    <div className={s.equipmentView__items}>
      {craftableItems
        .filter(item => item.type === 'armor')
        .map(item => (
          <div className={s.equipmentView__itemWrapper} key={item.id}>
            <Item data={item} onClick={() => onItemClick(item)} />
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
        {matsToCraft.map((mat: Material) => (
          <Item
            data={{ ...mat, price: 0, purchasable: false }}
            simple
            key={mat.id}
          />
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

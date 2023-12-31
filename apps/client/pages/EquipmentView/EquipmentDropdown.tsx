import { toast } from 'react-toastify';
import { ItemActions, Item as TItem } from '@mhgo/types';
import { Button } from '@mhgo/front';

import { Dropdown, Flash, Modal } from '@mhgo/front';
import {
  useItemActionsApi,
  useUpdateUserHealth,
  useUserConsumeItemsApi,
  useUserEquipItemApi,
} from '@mhgo/front';
import { useUser } from '../../hooks/useUser';
import { CraftConfirmation } from './Craft/CraftConfirmation';

import s from './EquipmentCraft.module.scss';
import { useState } from 'react';
import { Item } from '@mhgo/front';

type Action = keyof ItemActions['action'] | 'craft';
export const EquipmentDropdown = ({
  item,
  useOnly = false,
}: {
  item: TItem;
  useOnly?: boolean;
}) => {
  const [action, setAction] = useState<Action>('craft');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: itemAction } = useItemActionsApi(item.id);
  const { userId } = useUser();
  const { mutate: mutateItemEquip } = useUserEquipItemApi(userId, item.id);
  const { mutate: mutateConsumeItem } = useUserConsumeItemsApi(userId);
  const { mutate: mutateUserHealth, isSuccess: isHealedSuccessfully } =
    useUpdateUserHealth(userId);

  const onItemCraft = () => {
    if (!item.craftable) return;
    setAction('craft');
    setIsModalOpen(true);
  };
  const onItemEquip = () => {
    // TODO if armor or weapon, show stats and how much they differ from current loadout
    if (item.equippable) mutateItemEquip();
  };
  const onItemUse = () => {
    if (!item.usable || !itemAction) {
      toast.info(`This item doesn't have any use yet!`);
      return;
    }
    if (itemAction.text) {
      setAction('text');
      setIsModalOpen(true);
    }
    if (itemAction.img) {
      setAction('img');
      setIsModalOpen(true);
    }
    if (itemAction.redirect) {
      window.open(itemAction.redirect);
    }
    if (itemAction.heal) {
      mutateUserHealth({ healthChange: itemAction.heal });
      toast.success(`Healed for ${itemAction.heal}!`);
    }
    if (item.consumable) {
      mutateConsumeItem([{ itemId: item.id, amountUsed: 1 }]);
    }
  };

  return (
    <div className={s.equipmentView__itemWrapper} key={item.id}>
      <Flash type="green" isActivated={isHealedSuccessfully} />
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        {!useOnly && action === 'craft' && item.craftable && (
          <CraftConfirmation itemId={item.id} setIsModalOpen={setIsModalOpen} />
        )}
        {action === 'text' && (
          <div className={s.equipmentView__itemDesc}>
            {itemAction?.text ??
              'Here should be a description of this item, but it got lost somewhere. Sorry. :c'}
            <Button label="OK " onClick={() => setIsModalOpen(false)} simple />
          </div>
        )}
        {action === 'img' && (
          <div className={s.equipmentView__itemDesc}>
            <img src={itemAction?.img} className={s.equipmentView__itemImg} />
            <Button label="OK " onClick={() => setIsModalOpen(false)} simple />
          </div>
        )}
      </Modal>
      <Dropdown
        content={
          <div className={s.equipmentDropdown}>
            <div className={s.equipmentDropdown__section}>
              <span style={{ fontWeight: 900 }}>{item.name}</span>
              <span style={{ fontStyle: 'italic' }}>"{item.description}"</span>
            </div>
            <div className={s.equipmentDropdown__section}>
              {!useOnly && item.craftable && (
                <Button simple label="Craft" onClick={onItemCraft} />
              )}
              {!useOnly && item.equippable && (
                <Button simple label="Equip" onClick={onItemEquip} />
              )}
              {item.usable && itemAction && (
                <Button simple label="Use" onClick={onItemUse} />
              )}
            </div>
          </div>
        }>
        <Item data={{ ...item, purchasable: false }} />
      </Dropdown>
    </div>
  );
};

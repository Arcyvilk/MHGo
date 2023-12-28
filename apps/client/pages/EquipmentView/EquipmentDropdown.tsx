import { toast } from 'react-toastify';
import { ItemUses, Item as TItem } from '@mhgo/types';

import { Button, Dropdown, Flash, Modal } from '../../components';
import {
  useItemUseApi,
  useUpdateUserHealth,
  useUserEquipItemApi,
} from '../../api';
import { useUser } from '../../hooks/useUser';
import { CraftConfirmation } from './Craft/CraftConfirmation';

import s from './EquipmentCraft.module.scss';
import { useState } from 'react';
import { Item } from '../../containers';

type Action = keyof ItemUses['action'] | 'craft';
export const EquipmentDropdown = ({ item }: { item: TItem }) => {
  const [action, setAction] = useState<Action>('craft');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: itemUses } = useItemUseApi(item.id);
  const { userId } = useUser();
  const { mutate: mutateItemEquip } = useUserEquipItemApi(userId, item.id);
  const { mutate: mutateUserHealth, isSuccess: isHealedSuccessfully } =
    useUpdateUserHealth(userId);

  const onItemCraft = () => {
    if (!item.craftable) return;
    setAction('craft');
    setIsModalOpen(true);
  };
  const onItemEquip = () => {
    if (item.equippable) mutateItemEquip();
  };
  const onItemUse = () => {
    if (!item.usable || !itemUses) return;
    if (itemUses.redirect) {
      window.open(itemUses.redirect);
      return;
    }
    if (itemUses.text) {
      setAction('text');
      setIsModalOpen(true);
      return;
    }
    if (itemUses.heal) {
      // TODO this doesn't consume the item
      mutateUserHealth({ healthChange: itemUses.heal });
      toast.success(`Healed for ${itemUses.heal}!`);
      return;
    }
    toast.info(`This item doesn't have any use yet!`);
  };

  return (
    <div className={s.equipmentView__itemWrapper} key={item.id}>
      <Flash type="green" isActivated={isHealedSuccessfully} />
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onClose={() => {}}>
        {action === 'craft' && (
          <CraftConfirmation itemId={item.id} setIsModalOpen={setIsModalOpen} />
        )}
        {action === 'text' && (
          <div className={s.equipmentView__itemDesc}>
            {itemUses?.text ?? 'Huh?'}
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
              {item.craftable && (
                <Button simple label="Craft" onClick={onItemCraft} />
              )}
              {item.equippable && (
                <Button simple label="Equip" onClick={onItemEquip} />
              )}
              {item.usable && itemUses && (
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

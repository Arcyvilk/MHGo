import { Item as TItem } from '@mhgo/types';
import { Button } from '../../components';

import s from './EquipmentCraft.module.scss';

type EquipmentActions = {
  onCraft: (itemId: string) => void;
  onUse: (itemId: string) => void;
  onEquip: (itemId: string) => void;
};

export const EquipmentDropdown = ({
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

import { Item as TItem } from '@mhgo/types';
import { Button } from '../../components';
import { useUserEquipItemApi } from '../../api';
import { useUser } from '../../hooks/useUser';

import s from './EquipmentCraft.module.scss';

type EquipmentActions = {
  onCraft: (itemId: string) => void;
  onUse: (itemId: string) => void;
};

export const EquipmentDropdown = ({
  item,
  onCraft,
  onUse,
}: EquipmentActions & {
  item: TItem;
}) => {
  const { userId } = useUser();
  const { mutate: mutateItemEquip } = useUserEquipItemApi(userId, item.id);

  const onItemCraft = () => {
    if (item.craftable) return onCraft(item.id);
  };
  const onItemEquip = () => {
    if (item.equippable) mutateItemEquip();
  };
  const onItemUse = () => {
    if (item.usable) return onUse(item.id);
  };

  return (
    <div className={s.equipmentDropdown}>
      {item.craftable && <Button label="Craft" onClick={onItemCraft} />}
      {item.equippable && <Button label="Equip" onClick={onItemEquip} />}
      {item.usable && <Button label="Use" onClick={onItemUse} />}
    </div>
  );
};

import { useMemo } from 'react';
import { Material } from '@mhgo/types';

import { Button, Tooltip } from '../../../components';
import { Item } from '../../../containers';
import { useItems } from '../../../hooks/useItems';
import { useCraftableItems } from '../../../hooks/useCraftableItems';

import s from './CraftConfirmation.module.scss';

type CraftConfirmationProps = {
  itemId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const CraftConfirmation = ({
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
          <Tooltip content={mat.name}>
            <Item
              data={{ ...mat, price: 0, purchasable: false }}
              simple
              key={mat.id}
            />
          </Tooltip>
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

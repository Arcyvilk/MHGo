import { Material } from '@mhgo/types';

import { Button, Tooltip } from '../../../components';
import { Item } from '../../../containers';
import { useItems } from '../../../hooks/useItems';
import { useCraftableItems } from '../../../hooks/useCraftableItems';

import s from './CraftConfirmation.module.scss';
import { useUser } from '../../../hooks/useUser';
import { useItemCraftListApi } from '../../../api';

type CraftConfirmationProps = {
  itemId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const CraftConfirmation = ({
  itemId,
  setIsModalOpen,
}: CraftConfirmationProps) => {
  const { userId } = useUser();
  const { getItem } = useItems();
  const { onCraft, getItemCraftingList } = useCraftableItems();
  const { data: itemCraftList } = useItemCraftListApi(userId, itemId);

  const item = getItem(itemId);
  const matsToCraft = getItemCraftingList(itemId);

  const canBeCrafted = itemCraftList.reduce((sum, curr) => {
    if (curr.userAmount < curr.amount) return false;
    return sum;
  }, true);

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
        {matsToCraft.map((mat: Material, index: number) => {
          const matRequirements = itemCraftList.find(i => i.id === mat.id);
          const isNotOwned =
            (matRequirements?.userAmount ?? 0) < (matRequirements?.amount ?? 0);

          return (
            <Tooltip
              content={
                <div>
                  <div>{mat.name}</div>
                  <div>
                    <span style={{ fontWeight: 400 }}>
                      Required for crafting:{' '}
                    </span>
                    <span
                      style={
                        isNotOwned ? { color: 'red' } : { color: 'green' }
                      }>
                      {matRequirements?.userAmount}
                    </span>
                    /{matRequirements?.amount}
                  </div>
                </div>
              }
              key={index}>
              <Item
                data={{ ...mat, price: 0, purchasable: false }}
                simple
                isNotOwned={isNotOwned}
              />
            </Tooltip>
          );
        })}
      </div>
      <div className={s.craftConfirmation__buttons}>
        <Button
          label="Cancel"
          onClick={onNo}
          simple
          variant={Button.Variant.DANGER}
        />
        <Button
          label="Craft"
          onClick={onYes}
          simple
          disabled={!canBeCrafted}
          title={
            canBeCrafted
              ? null
              : 'You have insufficient materials to craft this!'
          }
        />
      </div>
    </div>
  );
};

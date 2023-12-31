import { Material } from '@mhgo/types';

import { Button, Tooltip } from '@mhgo/front';
import { Item } from '@mhgo/front';
import { useItemCraft } from '../../../hooks/useItemCraft';

import s from './CraftConfirmation.module.scss';

type CraftConfirmationProps = {
  itemId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const CraftConfirmation = ({
  itemId,
  setIsModalOpen,
}: CraftConfirmationProps) => {
  const { item, ingredientAmounts, onCraft, getItemIngredients } =
    useItemCraft(itemId);
  const ingredients = getItemIngredients();

  const canBeCrafted = ingredientAmounts.reduce((sum, curr) => {
    if (curr.userAmount < curr.amount) return false;
    return sum;
  }, true);

  const onYes = () => {
    setIsModalOpen(false);
    onCraft();
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
        {ingredients.map((mat: Material, index: number) => {
          const requirements = ingredientAmounts.find(i => i.id === mat.id);
          const isNotOwned =
            (requirements?.userAmount ?? 0) < (requirements?.amount ?? 0);

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
                      {requirements?.userAmount}
                    </span>
                    /{requirements?.amount}
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

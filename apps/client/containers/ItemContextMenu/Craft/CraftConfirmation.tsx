import { useEffect, useMemo, useState } from 'react';

import { Material, Item as TItem } from '@mhgo/types';
import { Button, Item, Tooltip } from '@mhgo/front';
import { useItemCraft } from '../../../hooks/useItemCraft';
import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../../hooks/useUpdateUserAchievement';
import { ModalAchievementUnlocked } from '../../../pages/FightView/ModalAchievementUnlocked';

import s from './CraftConfirmation.module.scss';

type CraftConfirmationProps = {
  itemId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const CraftConfirmation = ({
  itemId,
  setIsModalOpen,
}: CraftConfirmationProps) => {
  const {
    item,
    ingredientAmounts,
    onCraft,
    getItemIngredients,
    isSuccess: isCraftedSuccessfully,
  } = useItemCraft(itemId);
  const {
    isModalAchievementUnlockedOpen,
    setIsModalAchievementUnlockedOpen,
    achievementId,
  } = useCraftingAchievements(item as TItem, isCraftedSuccessfully);

  const ingredients = getItemIngredients();

  const canBeCrafted = ingredientAmounts.reduce((sum, curr) => {
    if (curr.userAmount < curr.amount) return false;
    return sum;
  }, true);

  const onYes = () => {
    onCraft();
  };
  const onNo = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={s.craftConfirmation}>
      <ModalAchievementUnlocked
        achievementId={achievementId}
        isOpen={isModalAchievementUnlockedOpen}
        setIsOpen={setIsModalAchievementUnlockedOpen}
      />
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
                data={{ ...mat, purchasable: false }}
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
          variant={Button.Variant.GHOST}
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

const useCraftingAchievements = (
  item: TItem,
  isCraftedSuccessfully: boolean,
) => {
  const [achievementId, setAchievementId] = useState<string | null>();
  const [isModalAchievementUnlockedOpen, setIsModalAchievementUnlockedOpen] =
    useState(false);

  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();

  const isAchievementUnlocked = useMemo(() => {
    if (!isAchievementUpdateSuccess) return;
    const { unlockedNewAchievement } = getIsAchievementUnlocked(
      AchievementId.DARK_ARTS,
    );
    return unlockedNewAchievement;
  }, [isAchievementUpdateSuccess]);

  // Call for the achievement when item is successfully crafted
  useEffect(() => {
    if (isCraftedSuccessfully) {
      if (item.id === 'grimoire') {
        setAchievementId(AchievementId.DARK_ARTS);
        mutate({ achievementId: AchievementId.DARK_ARTS, progress: 1 });
      }
    }
  }, [isCraftedSuccessfully]);

  // Open achievement modal when achievement is successfully unlocked
  useEffect(() => {
    if (isAchievementUnlocked) {
      setIsModalAchievementUnlockedOpen(true);
    }
  }, [isAchievementUnlocked]);

  return {
    achievementId,
    isModalAchievementUnlockedOpen,
    setIsModalAchievementUnlockedOpen,
  };
};

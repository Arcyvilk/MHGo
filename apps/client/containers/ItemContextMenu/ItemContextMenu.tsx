import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { ItemActions, Item as TItem } from '@mhgo/types';
import {
  Button,
  Item,
  SoundSE,
  useSounds,
  useUserHealthApi,
} from '@mhgo/front';
import {
  useItemActionsApi,
  useUpdateUserHealthApi,
  useUserConsumeItemsApi,
  useUserEquipItemApi,
  Dropdown,
  Flash,
  Modal,
} from '@mhgo/front';
import { useUser } from '../../hooks/useUser';
import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../hooks/useUpdateUserAchievement';
import { ModalAchievement } from '../../containers';
import { useAppContext } from '../../utils/context';
import { CraftConfirmation } from './Craft/CraftConfirmation';
import { PurchaseConfirmation } from './Purchase/PurchaseConfirmation';
import { ItemStats } from './ItemStats';

import s from './ItemContextMenu.module.scss';

type Action = keyof ItemActions['action'] | 'craft' | 'purchase';
export const ItemContextMenu = ({
  item,
  useOnly = false,
  purchaseOnly = false,
  isItemOwned = true,
}: {
  item: TItem;
  useOnly?: boolean;
  purchaseOnly?: boolean;
  isItemOwned?: boolean;
}) => {
  const navigate = useNavigate();
  const { setMusic } = useAppContext();
  const { playSound } = useSounds(setMusic);
  const [action, setAction] = useState<Action>('craft');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: itemAction } = useItemActionsApi(item.id);

  const { userId } = useUser();
  const { mutate: mutateItemEquip } = useUserEquipItemApi(userId, item.id);
  const { mutate: mutateConsumeItem } = useUserConsumeItemsApi(userId);
  const { mutate: mutateUserHealth, isSuccess: isHealedSuccessfully } =
    useUpdateUserHealthApi(userId);

  const { isModalAchievementOpen, setIsModalAchievementOpen, achievementId } =
    useItemActionAchievements(item as TItem, isHealedSuccessfully);

  const onItemCraft = () => {
    if (!item.craftable) return;
    setAction('craft');
    setIsModalOpen(true);
  };

  const onItemEquip = () => {
    if (item.equippable) {
      mutateItemEquip();
      toast.success(`Equipped ${item.name}!`);
    }
  };

  const onItemPurchase = () => {
    const shopPath = '/shop';
    if (location.pathname !== shopPath) navigate('/shop');
    else {
      setAction('purchase');
      setIsModalOpen(true);
    }
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
      if (itemAction.heal > 0) {
        playSound(SoundSE.BUBBLE);
        toast.success(`Healed for ${itemAction.heal}!`);
      } else {
        playSound(SoundSE.OUCH);
        toast.success(`Damaged yourself for ${Math.abs(itemAction.heal)}!`);
      }
    }
    if (item.consumable) {
      mutateConsumeItem([{ itemId: item.id, amountUsed: 1 }]);
    }
  };

  return (
    <div className={s.itemContextMenu} key={item.id}>
      <Flash
        type={(itemAction?.heal ?? 0) >= 0 ? 'green' : 'red'}
        isActivated={isHealedSuccessfully}
      />
      <ModalAchievement
        achievementId={achievementId}
        isOpen={isModalAchievementOpen}
        setIsOpen={setIsModalAchievementOpen}
      />
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        {!useOnly && action === 'craft' && item.craftable && (
          <CraftConfirmation itemId={item.id} setIsModalOpen={setIsModalOpen} />
        )}
        {purchaseOnly && action === 'purchase' && item.purchasable && (
          <PurchaseConfirmation
            itemId={item.id}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {action === 'text' && (
          <div className={s.itemContextMenu__itemDesc}>
            {itemAction?.text ??
              'Here should be a description of this item, but it got lost somewhere. Sorry. :c'}
            <Button label="OK " onClick={() => setIsModalOpen(false)} simple />
          </div>
        )}
        {action === 'img' && (
          <div className={s.itemContextMenu__itemDesc}>
            <img src={itemAction?.img} className={s.itemContextMenu__itemImg} />
            <Button label="OK " onClick={() => setIsModalOpen(false)} simple />
          </div>
        )}
      </Modal>
      <Dropdown
        content={
          <div className={s.itemContextMenu__dropdown}>
            <div className={s.itemContextMenu__section}>
              {!isItemOwned && (
                <span style={{ fontWeight: 900, color: 'red' }}>NOT OWNED</span>
              )}
              <span style={{ fontWeight: 900 }}>{item.name}</span>
              <span style={{ fontStyle: 'italic' }}>"{item.description}"</span>
            </div>
            <div className={s.itemContextMenu__section}>
              <ItemStats itemId={item.id} compare />
            </div>
            <div className={s.itemContextMenu__section}>
              {!useOnly && !purchaseOnly && item.craftable && (
                <Button simple label="Craft" onClick={onItemCraft} />
              )}
              {!useOnly && !purchaseOnly && item.equippable && isItemOwned && (
                <Button simple label="Equip" onClick={onItemEquip} />
              )}
              {item.purchasable && (
                <Button simple label="Purchase" onClick={onItemPurchase} />
              )}
              {!purchaseOnly && item.usable && itemAction && isItemOwned && (
                <Button simple label="Use" onClick={onItemUse} />
              )}
            </div>
          </div>
        }>
        <Item
          data={{ ...item, purchasable: purchaseOnly }}
          isNotOwned={!isItemOwned}
        />
      </Dropdown>
    </div>
  );
};

const useItemActionAchievements = (
  item: TItem,
  isUsedSuccessfully: boolean,
) => {
  const { userId } = useUser();
  const [achievementId, setAchievementId] = useState<string | null>();
  const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);
  const { data: userHealth } = useUserHealthApi(userId);

  const isUserFullHP = useMemo(() => {
    return userHealth.currentHealth === userHealth.maxHealth;
  }, [userHealth]);

  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();

  const isAchievementUnlocked = useMemo(() => {
    if (!isAchievementUpdateSuccess) return;
    const { unlockedNewAchievement: unlockedTGTG } = getIsAchievementUnlocked(
      AchievementId.TGTG,
    );
    const { unlockedNewAchievement: unlockedForWhy } = getIsAchievementUnlocked(
      AchievementId.FOR_WHY,
    );
    if (unlockedTGTG || unlockedForWhy) return true;
    return false;
  }, [isAchievementUpdateSuccess]);

  useEffect(() => {
    if (isUsedSuccessfully) {
      if (item.id === 'deer_burger' && isUserFullHP) {
        // Call for the achievement when deer burger is successfully eaten
        setAchievementId(AchievementId.TGTG);
        mutate({ achievementId: AchievementId.TGTG, progress: 1 });
      }
      if (item.id === 'nettle_whip' && userHealth.currentHealth <= 1) {
        // Call for the achievement when killing yourself with nettle whip
        setAchievementId(AchievementId.FOR_WHY);
        mutate({ achievementId: AchievementId.FOR_WHY, progress: 1 });
      }
    }
  }, [isUsedSuccessfully]);

  // Open achievement modal when achievement is successfully unlocked
  useEffect(() => {
    if (isAchievementUnlocked) {
      setIsModalAchievementOpen(true);
    }
  }, [isAchievementUnlocked]);

  return {
    achievementId,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  };
};

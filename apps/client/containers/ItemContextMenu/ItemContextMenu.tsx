import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Instance } from 'tippy.js';

import { ItemActions, Item as TItem } from '@mhgo/types';
import {
  Button,
  Item,
  SoundSE,
  useNavigateWithScroll,
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

type ItemContextMenuProps = {
  item: TItem;
  useOnly?: boolean;
  purchaseOnly?: boolean;
  isItemOwned?: boolean;
};
export const ItemContextMenu = (props: ItemContextMenuProps) => {
  const { item, purchaseOnly = false, isItemOwned = true } = props;

  const [action, setAction] = useState<Action>('craft');
  const [isModalActionOpen, setIsModalActionOpen] = useState(false);
  const [tippyInstance, setTippyInstance] = useState<Instance | null>(null);

  const openActionModal = (selectedAction: Action) => {
    // Open additional action modal and close tippy dropdown
    setAction(selectedAction);
    setIsModalActionOpen(true);
    tippyInstance?.hide();
  };

  return (
    <div className={s.itemContextMenu} key={item.id}>
      {isModalActionOpen && (
        <LoadActionModal
          {...props}
          action={action}
          isOpen={isModalActionOpen}
          setIsOpen={setIsModalActionOpen}
        />
      )}
      <Dropdown
        setInstance={setTippyInstance}
        content={<LoadDropdown {...props} openActionModal={openActionModal} />}>
        <Item
          data={{ ...item, purchasable: purchaseOnly }}
          isNotOwned={!isItemOwned}
        />
      </Dropdown>
    </div>
  );
};

type LoadActionModalProps = {
  action: Action;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
const LoadActionModal = ({
  // ItemContextMenuProps
  item,
  useOnly = false,
  purchaseOnly = false,
  // LoadActionModalProps
  action,
  isOpen,
  setIsOpen,
}: ItemContextMenuProps & LoadActionModalProps) => {
  const { data: itemAction } = useItemActionsApi(item.id);

  const hasPurchaseAction =
    purchaseOnly && action === 'purchase' && item.purchasable;
  const hasCraftAction = !useOnly && action === 'craft' && item.craftable;
  const hasTextAction = action === 'text';
  const hasImgAction = action === 'img';

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {hasCraftAction && (
        <CraftConfirmation itemId={item.id} setIsModalOpen={setIsOpen} />
      )}
      {hasPurchaseAction && (
        <PurchaseConfirmation itemId={item.id} setIsModalOpen={setIsOpen} />
      )}
      {hasTextAction && (
        <div className={s.itemContextMenu__itemDesc}>
          {itemAction?.text ??
            'Here should be a description of this item, but it got lost somewhere. Sorry. :c'}
          <Button label="OK " onClick={() => setIsOpen(false)} simple />
        </div>
      )}
      {hasImgAction && (
        <div className={s.itemContextMenu__itemDesc}>
          <img src={itemAction?.img} className={s.itemContextMenu__itemImg} />
          <Button label="OK " onClick={() => setIsOpen(false)} simple />
        </div>
      )}
    </Modal>
  );
};

type LoadDropdownProps = {
  openActionModal: (selectedAction: Action) => void;
};
const LoadDropdown = ({
  // ItemContextMenuProps
  item,
  useOnly = false,
  purchaseOnly = false,
  isItemOwned = true,
  // LoadDropdownProps
  openActionModal,
}: ItemContextMenuProps & LoadDropdownProps) => {
  const { setMusic } = useAppContext();
  const { playSound } = useSounds(setMusic);
  const { navigateWithoutScroll } = useNavigateWithScroll();

  const { data: itemAction } = useItemActionsApi(item.id);
  const { userId } = useUser();

  const { mutate: mutateConsumeItem } = useUserConsumeItemsApi(userId);
  const { mutate: mutateItemEquip } = useUserEquipItemApi(userId, item.id);
  const { mutate: mutateUserHealth, isSuccess: isHealedSuccessfully } =
    useUpdateUserHealthApi(userId);

  const { isModalAchievementOpen, setIsModalAchievementOpen, achievementId } =
    useItemActionAchievements(item as TItem, isHealedSuccessfully);

  const onItemCraft = () => {
    if (!item.craftable) return;
    openActionModal('craft');
  };

  const onItemEquip = () => {
    if (item.equippable) {
      mutateItemEquip();
      toast.success(`Equipped ${item.name}!`);
    }
  };

  const onItemPurchase = () => {
    const shopPath = '/shop';
    if (location.pathname !== shopPath) navigateWithoutScroll('/shop');
    else openActionModal('purchase');
  };

  const onItemUse = () => {
    if (!item.usable || !itemAction) {
      toast.info(`This item doesn't have any use yet!`);
      return;
    }
    if (itemAction.text) {
      openActionModal('text');
    }
    if (itemAction.img) {
      openActionModal('img');
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
        playSound(SoundSE.PUNCH);
        toast.error(`Damaged yourself for ${Math.abs(itemAction.heal)}!`);
      }
    }
    if (item.consumable) {
      mutateConsumeItem([{ itemId: item.id, amountUsed: 1 }]);
    }
  };

  return (
    <>
      <Flash
        type={(itemAction?.heal ?? 0) >= 0 ? 'green' : 'red'}
        isActivated={isHealedSuccessfully}
      />
      <ModalAchievement
        achievementId={achievementId}
        isOpen={isModalAchievementOpen}
        setIsOpen={setIsModalAchievementOpen}
      />
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
    </>
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
      if (
        item.id === 'nettle_whip' &&
        userHealth.currentHealth <= 1 &&
        userHealth.currentHealth > 0
      ) {
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

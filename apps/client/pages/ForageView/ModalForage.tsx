import { useEffect, useState, useCallback, useMemo } from 'react';

import { Material } from '@mhgo/types';
import { Item, useUserMaterialsApi } from '@mhgo/front';
import {
  Button,
  Loader,
  Modal,
  QueryBoundary,
  addCdnUrl,
  useResourceMarkerDropsApi,
} from '@mhgo/front';

import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../hooks/useUpdateUserAchievement';
import { useUser } from '../../hooks/useUser';
import { ModalAchievement } from '../../containers';

import s from './ModalForage.module.scss';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalForage = ({ isOpen, setIsOpen, onClose }: ModalProps) => (
  <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => {}}>
    <div className={s.result}>
      <h1 className={s.result__title}>Success!</h1>
      <QueryBoundary fallback={<Loader />}>
        <Load onClose={onClose} />
      </QueryBoundary>
    </div>
  </Modal>
);

const Load = ({ onClose }: { onClose: () => void }) => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('markerId') ?? '';

  const { userId } = useUser();
  const { data: drops, mutate, isSuccess } = useResourceMarkerDropsApi(userId);
  const [isLootRedeemed, setIsLootRedeemed] = useState(false);

  const {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  } = useForagingAchievements();

  const redeemLoot = useCallback(() => {
    if (isLootRedeemed) return;
    setIsLootRedeemed(true);
    mutate({ markerId });
  }, [isLootRedeemed]);

  useEffect(() => {
    redeemLoot();
  }, []);

  useEffect(() => {
    if (isSuccess) updateAchievement(drops);
  }, [isSuccess]);

  const listOfDrops = drops.map(drop => {
    const data = {
      ...drop,
      img: addCdnUrl(drop.img),
      purchasable: false,
    };
    return <Item data={data} key={drop.id} />;
  });

  return (
    <div className={s.modalSuccess}>
      {isModalAchievementOpen && (
        <ModalAchievement
          achievementId={achievementId}
          isOpen={isModalAchievementOpen}
          setIsOpen={setIsModalAchievementOpen}
        />
      )}
      <p className={s.result__desc}>You foraged the following items:</p>
      <div className={s.result__drops}>
        {isSuccess ? (
          listOfDrops?.length ? (
            listOfDrops
          ) : (
            "NOTHING! God damn it you're so unlucky ;-;"
          )
        ) : (
          <Loader />
        )}
      </div>
      <Button label="Claim" onClick={onClose} simple />
    </div>
  );
};

const useForagingAchievements = () => {
  const [achievementId, setAchievementId] = useState<string | null>();
  const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);
  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();
  const { userId } = useUser();
  const { data: userMaterials } = useUserMaterialsApi(userId);

  const isAchievementUnlocked = useMemo(() => {
    const { unlockedNewAchievement: unlockedEasterEgg } =
      getIsAchievementUnlocked(AchievementId.EASTER_EGG);
    const { unlockedNewAchievement: unlockedBugs } = getIsAchievementUnlocked(
      AchievementId.BUG_COLLECTOR,
    );
    if (unlockedEasterEgg || unlockedBugs) return true;
    return false;
  }, [isAchievementUpdateSuccess]);

  const updateAchievement = (drops: Material[]) => {
    // BUG COLLECTOR ACHIEVEMENT
    const bugIds = ['bug1', 'bug2', 'bug3', 'bug4', 'bug5'];
    const newBugs = drops.filter(d => bugIds.includes(d.id)).map(d => d.id);
    if (newBugs.length) {
      const oldBugs = userMaterials
        .filter(m => m.amount > 0 && bugIds.includes(m.id))
        .map(m => m.id);

      const allBugs = [...new Set([...oldBugs, ...newBugs])]?.length;
      setAchievementId(AchievementId.BUG_COLLECTOR);
      mutate({
        achievementId: AchievementId.BUG_COLLECTOR,
        progress: 0,
        newValue: allBugs,
      });
    }
    // EASTER EGG ACHIEVEMENT
    if (drops.some(drop => drop.id === 'easter_egg')) {
      setAchievementId(AchievementId.EASTER_EGG);
      mutate({ achievementId: AchievementId.EASTER_EGG, progress: 1 });
    }
  };

  useEffect(() => {
    if (isAchievementUnlocked) setIsModalAchievementOpen(true);
  }, [isAchievementUnlocked]);

  return {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  };
};

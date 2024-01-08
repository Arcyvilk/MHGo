import { useEffect, useState, useCallback, useMemo } from 'react';

import { Item } from '@mhgo/front';
import { addCdnUrl, useResourceMarkerDropsApi } from '@mhgo/front';
import { useUser } from '../../hooks/useUser';
import { Button, Loader, Modal, QueryBoundary } from '@mhgo/front';

import s from './ModalForage.module.scss';
import { ModalAchievement } from '../../containers';
import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../hooks/useUpdateUserAchievement';
import { Material } from '@mhgo/types';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalForage = ({ isOpen, setIsOpen, onClose }: ModalProps) => (
  <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
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
  const markerId = params.get('id') ?? '';

  const [isLootRedeemed, setIsLootRedeemed] = useState(false);
  const { userId } = useUser();
  const { data: drops, mutate, isSuccess } = useResourceMarkerDropsApi(userId);

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

  const isAchievementUnlocked = useMemo(() => {
    const { unlockedNewAchievement } = getIsAchievementUnlocked(
      AchievementId.EASTER_EGG,
    );
    return unlockedNewAchievement;
  }, [isAchievementUpdateSuccess]);

  const updateAchievement = (drops: Material[]) => {
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

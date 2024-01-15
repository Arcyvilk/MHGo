import { useEffect, useMemo, useState } from 'react';
import { Button, Loader, Modal, QueryBoundary } from '@mhgo/front';

import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../hooks/useUpdateUserAchievement';

import s from './ModalResult.module.scss';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { ModalAchievement } from '../../containers';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalFailure = ({ isOpen, setIsOpen, onClose }: ModalProps) => (
  <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => {}}>
    <div className={s.result}>
      <h1 className={s.result__title}>Failure!</h1>
      <QueryBoundary fallback={<Loader />}>
        <Load onClose={onClose} />
      </QueryBoundary>
    </div>
  </Modal>
);

const Load = ({ onClose }: { onClose: () => void }) => {
  const { monster, isDummy } = useMonsterMarker();

  const {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  } = useDyingAchievements(monster?.id);

  useEffect(() => {
    if (isDummy) updateAchievement();
  }, []);

  return (
    <>
      {isModalAchievementOpen && (
        <ModalAchievement
          achievementId={achievementId}
          isOpen={isModalAchievementOpen}
          setIsOpen={setIsModalAchievementOpen}
        />
      )}
      <div className={s.result__content}>
        You're such a noob that you died in a clicker game ._. Heal yourself and
        try again to defend your honour.
      </div>
      <Button label="I acknowledge my noobness ;-;" onClick={onClose} simple />
    </>
  );
};

const useDyingAchievements = (monsterId: string) => {
  const [achievementId, setAchievementId] = useState<string | null>();
  const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);
  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();

  const isAchievementUnlocked = useMemo(() => {
    const { unlockedNewAchievement: unlockedRevenge } =
      getIsAchievementUnlocked(AchievementId.SWEET_REVENGE);
    return unlockedRevenge;
  }, [isAchievementUpdateSuccess]);

  const updateAchievement = () => {
    if (monsterId === 'dummy') {
      setAchievementId(AchievementId.SWEET_REVENGE);
      mutate({ achievementId: AchievementId.SWEET_REVENGE, progress: 1 });
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

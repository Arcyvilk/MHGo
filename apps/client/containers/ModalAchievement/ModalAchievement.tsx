import { useEffect } from 'react';
import {
  Button,
  Modal,
  Rays,
  SoundSE,
  useAchievementsApi,
  useNavigateWithScroll,
  useSounds,
} from '@mhgo/front';

import s from './ModalAchievement.module.scss';

type ModalProps = {
  achievementId?: string | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const ModalAchievement = ({
  achievementId,
  isOpen,
  setIsOpen,
}: ModalProps) => {
  const { navigateWithoutScroll } = useNavigateWithScroll();
  const { playSound } = useSounds(undefined);
  const { data: achievements } = useAchievementsApi();
  const achievement = achievements.find(a => a.id === achievementId);

  useEffect(() => {
    if (isOpen && achievement) playSound(SoundSE.TADA);
  }, [isOpen, achievement]);

  const onAchievementClick = () => {
    navigateWithoutScroll('/achievements');
  };

  if (!achievement) return null;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isHighModal onClose={() => {}}>
      <Rays />
      <div className={s.modalAchievement}>
        <h1 className={s.modalAchievement__title}>ACHIEVEMENT UNLOCKED!</h1>
        <div className={s.modalAchievement__content}>
          <div className={s.modalAchievement__achievement}>
            <img
              className={s.modalAchievement__achievement__image}
              src={achievement.img}
              onClick={onAchievementClick}
            />
            <div>{achievement.name}</div>
          </div>
        </div>
        <Button label="Yay!" onClick={() => setIsOpen(false)} simple />
      </div>
    </Modal>
  );
};

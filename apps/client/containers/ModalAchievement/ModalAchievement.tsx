import { Button, Modal, Rays, useAchievementsApi } from '@mhgo/front';

import s from './ModalAchievement.module.scss';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { data: achievements } = useAchievementsApi();
  const achievement = achievements.find(a => a.id === achievementId);

  const onAchievementClick = () => {
    navigate('/achievements');
  };

  if (!achievement) return null;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
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

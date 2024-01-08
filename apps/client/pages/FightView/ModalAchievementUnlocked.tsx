import { Button, Modal, Rays, useAchievementsApi } from '@mhgo/front';

import s from './ModalResult.module.scss';
import { useNavigate } from 'react-router-dom';

type ModalProps = {
  achievementId?: string | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const ModalAchievementUnlocked = ({
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
      <div className={s.result}>
        <h1 className={s.result__title}>ACHIEVEMENT UNLOCKED!</h1>
        <div className={s.result__content}>
          <div className={s.result__achievement}>
            <img
              className={s.result__achievement__image}
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

import { Button, Modal, Rays } from '@mhgo/front';

import s from './ModalResult.module.scss';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const ModalAchievementUnlocked = ({ isOpen, setIsOpen }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Rays />
      <div className={s.result}>
        <h1 className={s.result__title}>ACHIEVEMENT UNLOCKED!</h1>
        <div className={s.result__content}>
          Congratulations, you unlocked an achievement!
        </div>
        <Button label="Yay!" onClick={() => setIsOpen(false)} simple />
      </div>
    </Modal>
  );
};

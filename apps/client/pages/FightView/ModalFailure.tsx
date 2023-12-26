import { Modal } from '../../components';
import s from './FightView.module.scss';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalFailure = ({ isOpen, setIsOpen, onClose }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={onClose}>
      <div className={s.result}>
        <h1 className={s.result__title}>Failure!</h1>
        <div className={s.result__content}>
          You're such a noob that you died in a clicker game ._. Heal yourself
          and try again to defend your honour.
        </div>
      </div>
    </Modal>
  );
};

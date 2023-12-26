import { modifiers } from '../../utils/modifiers';
import s from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: () => void;
};
export const Modal = ({ children, isOpen, setIsOpen, onClose }: ModalProps) => {
  const onModalClose = () => {
    if (onClose) onClose();
    else setIsOpen(false);
  };

  return (
    <div className={modifiers(s, 'modal', { isOpen })} onClick={onModalClose}>
      <div className={s.modal__content}>{children}</div>
    </div>
  );
};

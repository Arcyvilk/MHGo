import { modifiers } from '../../utils/modifiers';
import s from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const Modal = ({ children, isOpen, setIsOpen }: ModalProps) => {
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={modifiers(s, 'modal', { isOpen })} onClick={onClose}>
      <div className={s.modal__content}>{children}</div>
    </div>
  );
};

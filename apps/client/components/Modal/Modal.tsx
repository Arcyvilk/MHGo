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

  const onPreventBubbling = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div className={modifiers(s, 'modal', { isOpen })} onClick={onModalClose}>
      <div className={s.modal__content} onClick={onPreventBubbling}>
        {children}
      </div>
    </div>
  );
};

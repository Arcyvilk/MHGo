import { modifiers } from '@mhgo/front';
import s from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  isHighModal?: boolean;
};
export const Modal = ({
  children,
  isHighModal = false,
  isOpen,
  setIsOpen,
  onClose,
}: ModalProps) => {
  const onModalClose = () => {
    if (onClose) onClose();
    else setIsOpen(false);
  };

  const onPreventBubbling = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div
      className={modifiers(s, 'modal', { isOpen, isHighModal })}
      onClick={onModalClose}>
      <div className={s.modal__content} onClick={onPreventBubbling}>
        {children}
      </div>
    </div>
  );
};

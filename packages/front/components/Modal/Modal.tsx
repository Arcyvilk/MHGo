import { modifiers } from '@mhgo/front';
import s from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  isHighModal?: boolean;
  isTransparent?: boolean;
  isOpaque?: boolean;
};
export const Modal = ({
  children,
  isHighModal = false,
  isTransparent = false,
  isOpaque = false,
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
      className={modifiers(s, 'modal', {
        isOpen,
        isHighModal,
        isTransparent,
        isOpaque,
      })}
      onClick={onModalClose}>
      {isTransparent ? (
        children
      ) : (
        <div
          className={modifiers(s, 'modal__content')}
          onClick={onPreventBubbling}>
          {children}
        </div>
      )}
    </div>
  );
};

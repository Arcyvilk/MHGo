import MuiModal, { ModalProps as MuiModalProps } from '@mui/material/Modal';
import { modifiers } from '@mhgo/front';
import s from './Modal.module.scss';

type CommonModalProps = {
  isHighModal?: boolean;
  isTransparent?: boolean;
  isOpaque?: boolean;
};
type ModalProps = CommonModalProps &
  Omit<MuiModalProps, 'open'> & {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onClose?: () => void;
  };
export const Modal = ({
  children,
  isHighModal = false,
  isTransparent = false,
  isOpaque = false,
  isOpen,
  setIsOpen,
  onClose,
  ...rest
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
    <MuiModal open={isOpen} {...rest} hideBackdrop>
      <div
        className={modifiers(s, 'modal', {
          isOpen,
          isHighModal,
          isTransparent,
          isOpaque,
          isAbsolute: true,
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
    </MuiModal>
  );
};

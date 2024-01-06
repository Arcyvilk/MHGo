import { Button, Modal } from '@mhgo/front';

import s from './ModalResult.module.scss';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalFailure = ({ isOpen, setIsOpen, onClose }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => {}}>
      <div className={s.result}>
        <h1 className={s.result__title}>Failure!</h1>
        <div className={s.result__content}>
          You're such a noob that you died in a clicker game ._. Heal yourself
          and try again to defend your honour.
        </div>
        <Button
          label="I acknowledge my noobness ;-;"
          onClick={onClose}
          simple
        />
      </div>
    </Modal>
  );
};

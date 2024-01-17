import { Size, SoundSE, useNavigateWithScroll, useSounds } from '@mhgo/front';
import { Icon } from '../Icon';

import s from './CloseButton.module.scss';

type CloseButtonProps = { backToHome?: boolean };
export const CloseButton = ({ backToHome = false }: CloseButtonProps) => {
  const { navigateWithScroll } = useNavigateWithScroll();
  const { playSound } = useSounds(undefined);

  const onClickClose = () => {
    playSound(SoundSE.CLICK);
    backToHome ? navigateWithScroll('/') : navigateWithScroll(-1);
  };

  return (
    <div className={s.closeButton}>
      <button
        className={s.closeButton__button}
        id="close"
        onClick={onClickClose}>
        <Icon icon="X" size={Size.SMALL} />
      </button>
    </div>
  );
};

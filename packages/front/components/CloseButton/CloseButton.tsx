import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';

import s from './CloseButton.module.scss';
import { Size, SoundSE, useSounds } from '@mhgo/front';

type CloseButtonProps = { backToHome?: boolean };
export const CloseButton = ({ backToHome = false }: CloseButtonProps) => {
  const navigate = useNavigate();
  const { playSound } = useSounds(undefined);

  const onClickClose = () => {
    playSound(SoundSE.CLICK);
    backToHome ? navigate('/') : navigate(-1);
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

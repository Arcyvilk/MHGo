import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';

import s from './CloseButton.module.scss';
import { Size } from '@mhgo/front';

export const CloseButton = () => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  return (
    <div className={s.closeButton}>
      <button className={s.closeButton__button} id="close" onClick={onClose}>
        <Icon icon="X" size={Size.SMALL} />
      </button>
    </div>
  );
};
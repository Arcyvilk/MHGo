import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';

import s from './CloseButton.module.scss';
import { Size } from '../../utils/size';

export const CloseButton = () => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate('/');
  };

  return (
    <button className={s.closeButton} onClick={onClose}>
      <Icon icon="X" size={Size.MEDIUM} className={s.closeButton__icon} />
    </button>
  );
};

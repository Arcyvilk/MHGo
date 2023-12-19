import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/Icon';

import s from './Buttons.module.scss';
import { IconType } from '../../assets/icons';
import { Button } from '../../components/Button';

const BUTTONS: { icon: IconType; label: string; link: string }[] = [
  { icon: 'Face', label: 'Friends', link: '/404' },
  { icon: 'Face', label: 'Party', link: '/404' },
  { icon: 'Face', label: 'Monster Guide', link: '/404' },
  { icon: 'Face', label: 'News', link: '/404' },
  { icon: 'Face', label: 'Hunter Medals', link: '/404' },
  { icon: 'Face', label: 'Item Box', link: '/404' },
  { icon: 'Face', label: 'Edit Appearance', link: '/404' },
  { icon: 'Face', label: 'Settings', link: '/404' },
];

export const Buttons = () => {
  const navigate = useNavigate();
  const onButtonClick = (link: string) => {
    navigate(link);
  };

  return (
    <div className={s.buttons}>
      {BUTTONS.map(b => (
        <Button
          onClick={() => onButtonClick(b.link)}
          label={
            <>
              <Icon icon={b.icon} />
              {b.label}
            </>
          }
        />
      ))}
    </div>
  );
};

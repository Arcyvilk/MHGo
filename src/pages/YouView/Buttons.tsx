import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/Icon';

import s from './Buttons.module.scss';
import { IconType } from '../../assets/icons';
import { Button } from '../../components/Button';

const BUTTONS: { icon: IconType; label: string; link: string }[] = [
  { icon: 'Friends', label: 'Friends', link: '/404' },
  { icon: 'Party', label: 'Party', link: '/404' },
  { icon: 'Monster', label: 'Monster Guide', link: '/404' },
  { icon: 'News', label: 'News', link: '/404' },
  { icon: 'Medal', label: 'Hunter Medals', link: '/404' },
  { icon: 'ItemBox', label: 'Item Box', link: '/404' },
  { icon: 'Appearance', label: 'Edit Appearance', link: '/404' },
  { icon: 'Gear', label: 'Settings', link: '/404' },
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
          key={b.label}
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

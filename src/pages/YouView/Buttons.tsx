import { ToastContainer, toast } from 'react-toastify';
import { Icon } from '../../components/Icon';
import { IconType } from '../../assets/icons';
import { Button } from '../../components/Button';
import { Size } from '../../utils/size';

import s from './Buttons.module.scss';
import { useNavigate } from 'react-router-dom';

const BUTTONS: { icon: IconType; label: string; link: string | null }[] = [
  { icon: 'Friends', label: 'Friends', link: null },
  { icon: 'Party', label: 'Party', link: null },
  { icon: 'Monster', label: 'Monster Guide', link: null },
  { icon: 'News', label: 'News', link: null },
  { icon: 'Medal', label: 'Hunter Medals', link: null },
  { icon: 'ItemBox', label: 'Item Box', link: '/items' },
  { icon: 'Appearance', label: 'Edit Appearance', link: null },
  { icon: 'Gear', label: 'Settings', link: '/settings' },
];

export const Buttons = () => {
  const navigate = useNavigate();

  const onButtonClick = (link: string | null) => {
    if (link) {
      navigate(link);
    } else
      toast.info('Not implemented yet :(', {
        closeOnClick: true,
        theme: 'dark',
        autoClose: 2500,
      });
  };

  return (
    <div className={s.buttons}>
      {BUTTONS.map(b => (
        <Button
          key={b.label}
          onClick={() => onButtonClick(b.link)}
          label={
            <>
              <Icon icon={b.icon} size={Size.MICRO} />
              {b.label}
            </>
          }
        />
      ))}
      <ToastContainer />
    </div>
  );
};

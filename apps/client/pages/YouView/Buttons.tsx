import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { IconType } from '@mhgo/front/assets/icons';
import { Button, Icon, Modal } from '@mhgo/front';

import { Size } from '@mhgo/front';
import { AppearanceModal, NewsModal, PartyModal } from '../ModalView';

import s from './Buttons.module.scss';

const BUTTONS: {
  icon: IconType;
  label: string;
  link: string | null;
  modal?: React.ReactNode;
}[] = [
  { icon: 'Friends', label: 'Friends', link: null },
  { icon: 'Party', label: 'Party', link: null, modal: <PartyModal /> },
  { icon: 'Monster', label: 'Monster Guide', link: '/guide' },
  { icon: 'News', label: 'News', link: null, modal: <NewsModal /> },
  { icon: 'Medal', label: 'Achievements', link: '/achievements' },
  { icon: 'ItemBox', label: 'Item Box', link: '/items' },
  {
    icon: 'Appearance',
    label: 'Edit Appearance',
    link: null,
    modal: <AppearanceModal />,
  },
  { icon: 'Gear', label: 'Settings', link: '/settings' },
  { icon: 'Medal', label: 'Credits', link: '/credits' },
];

export const Buttons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<React.ReactNode>();
  const navigate = useNavigate();

  const onButtonClick = (link: string | null, modal?: React.ReactNode) => {
    if (modal) {
      setIsModalOpen(true);
      setActiveModal(modal);
      return;
    }

    if (typeof link === 'string') {
      navigate(link);
      return;
    }

    toast.info('Coming soon!');
  };

  return (
    <div className={s.buttons}>
      {BUTTONS.map(b => (
        <Button
          key={b.label}
          onClick={() => onButtonClick(b.link, b.modal)}
          label={
            <>
              <Icon icon={b.icon} size={Size.MICRO} />
              {b.label}
            </>
          }
        />
      ))}
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        {activeModal}
      </Modal>
    </div>
  );
};

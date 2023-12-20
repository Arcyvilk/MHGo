import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button, Icon, Modal } from '../../components';
import { IconType } from '../../assets/icons';
import { Size } from '../../utils/size';
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
  { icon: 'Monster', label: 'Monster Guide', link: null },
  { icon: 'News', label: 'News', link: null, modal: <NewsModal /> },
  { icon: 'Medal', label: 'Hunter Medals', link: null },
  { icon: 'ItemBox', label: 'Item Box', link: '/items' },
  {
    icon: 'Appearance',
    label: 'Edit Appearance',
    link: null,
    modal: <AppearanceModal />,
  },
  { icon: 'Gear', label: 'Settings', link: '/settings' },
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

    toast.info('Not implemented yet :(');
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

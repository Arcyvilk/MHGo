import { useState } from 'react';

import { Icon, Modal, SimpleButton } from '../../components';
import { Size } from '../../utils/size';
import qr from '../../assets/qr.png';
import s from './Hunter.module.scss';

import { USER_NAME } from '../../_mock/settings';

export const Hunter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userName = USER_NAME;
  const userId = userName.toLowerCase().replace(' ', '_').concat('666');

  const onHunterViewToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <img className={s.qr} src={qr} />
      </Modal>
      <div className={s.hunter}>
        <div className={s.hunter__top}>TODO top</div>
        <div className={s.hunter__bottom}>
          <div className={s.hunter__info}>
            <h2 className={s.hunter__name}>{userName}</h2>
            <h2 className={s.hunter__id}>Niantic ID: {userId}</h2>
          </div>
          <SimpleButton
            onClick={onHunterViewToggle}
            label={
              <div className={s.hunter__button}>
                <Icon icon="QR" size={Size.TINY} />
                View
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

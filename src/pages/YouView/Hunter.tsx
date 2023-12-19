import { SimpleButton } from '../../components/SimpleButton';
import { Icon } from '../../components/Icon';
import qr from '../../assets/qr.png';

import s from './Hunter.module.scss';
import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { Size } from '../../utils/size';

const MOCKNAME = 'SzatanSzatanSzatan';

export const Hunter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userName = MOCKNAME;
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

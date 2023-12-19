import { SimpleButton } from '../../components/SimpleButton';
import { Icon } from '../../components/Icon';
import qr from '../../assets/qr.png';

import s from './Hunter.module.scss';
import { useState } from 'react';
import { Modal } from '../../components/Modal';

const MOCK = {
  NAME: 'Szatan',
  ID: 'szatan666',
};

export const Hunter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <h2 className={s.hunter__name}>{MOCK.NAME}</h2>
            <h2 className={s.hunter__id}>Niantic ID: {MOCK.ID}</h2>
          </div>
          <SimpleButton
            onClick={onHunterViewToggle}
            label={
              <div className={s.hunter__button}>
                <Icon icon="QR" />
                View
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

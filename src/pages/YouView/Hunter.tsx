import { useState } from 'react';

import { Icon, Modal, SimpleButton } from '../../components';
import { Size } from '../../utils/size';
import qr from '../../assets/qr.png';
import s from './Hunter.module.scss';
import { useUser } from '../../hooks/useUser';
import { USER_ID } from '../../_mock/settings';

export const Hunter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userName, userNianticId, userLevel } = useUser(USER_ID);

  const onHunterViewToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <img className={s.qr} src={qr} />
      </Modal>
      <div className={s.hunter}>
        <div className={s.hunter__top}>
          <div className={s.hunter__level}>HR {userLevel}</div>
          <img
            className={s.hunter__image}
            src="https://cdn.arcyvilk.com/mhgo/misc/hunter.jpg"
          />
        </div>
        <div className={s.hunter__bottom}>
          <div className={s.hunter__info}>
            <h2 className={s.hunter__name}>{userName}</h2>
            <h2 className={s.hunter__id}>Niantic ID: {userNianticId}</h2>
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

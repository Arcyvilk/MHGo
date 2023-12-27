import { useState } from 'react';

import { Button, Icon, Modal } from '../../components';
import { Size } from '../../utils/size';
import { useUser } from '../../hooks/useUser';
import qr from '../../assets/qr.png';

import s from './Hunter.module.scss';
import { addCdnUrl } from '../../utils/addCdnUrl';

export const Hunter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userName, userId, userLevel } = useUser();

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
            src={addCdnUrl('/misc/hunter.jpg')}
          />
        </div>
        <div className={s.hunter__bottom}>
          <div className={s.hunter__info}>
            <h2 className={s.hunter__name}>{userName}</h2>
            <h2 className={s.hunter__id}>Arcy ID: {userId}</h2>
          </div>
          <Button
            simple
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
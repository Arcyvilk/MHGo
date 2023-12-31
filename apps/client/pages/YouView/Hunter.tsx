import { useState } from 'react';

import { Button, Icon, Modal } from '@mhgo/front';
import qr from '@mhgo/front/assets/qr.png';

import { Size } from '@mhgo/front';
import { useUser } from '../../hooks/useUser';
import { addCdnUrl } from '../../utils/addCdnUrl';
import { HealthBarSimple } from '../../containers';
import { useUserHealthApi } from '../../api';

import s from './Hunter.module.scss';

export const Hunter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userName, userId, userLevel } = useUser();
  const { data: userHealth } = useUserHealthApi(userId);

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
          <div className={s.hunter__stats}>
            <div className={s.hunter__level}>HR {userLevel}</div>
            <HealthBarSimple
              maxHP={userHealth.maxHealth}
              currentHP={userHealth.currentHealth}
            />
          </div>
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
            style={{ maxWidth: '150px' }}
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

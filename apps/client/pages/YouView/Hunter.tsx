import { useState } from 'react';

import {
  Button,
  Icon,
  Modal,
  addCdnUrl,
  Size,
  useUserHealthApi,
  useNavigateWithScroll,
} from '@mhgo/front';

import { useUser } from '../../hooks/useUser';
import { HealthBarSimple } from '../../containers';

import s from './Hunter.module.scss';

export const Hunter = () => {
  const { navigateWithScroll } = useNavigateWithScroll();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userName, userId, userLevel } = useUser();
  const { data: userHealth } = useUserHealthApi(userId);

  const onHunterViewToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onCompanionView = () => {
    navigateWithScroll('/companion');
  };

  return (
    <>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <img className={s.qr} src={addCdnUrl('/misc/qr.jpg')} />
      </Modal>
      <div className={s.hunter}>
        <div className={s.hunter__companion}>
          <Button
            label={<Icon icon="DogPaw" />}
            variant={Button.Variant.GHOST}
            simple
            onClick={onCompanionView}
          />
        </div>
        <div className={s.hunter__top}>
          <div className={s.hunter__stats}>
            <div className={s.hunter__level}>HR {userLevel}</div>
            <HealthBarSimple
              maxHP={userHealth.maxHealth}
              currentHP={userHealth.roundCurrentHealth}
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

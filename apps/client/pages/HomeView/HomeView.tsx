import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon, IconType, Modal, SoundSE, useSounds } from '@mhgo/front';
import { Size } from '@mhgo/front';
import { QuickUseModal } from '../ModalView';
import { Map } from './Map';

import s from './HomeView.module.scss';
import { Tutorial } from '../../containers';
import { useMe } from '../../hooks/useAuth';
import { useUserTutorial } from '../../hooks/useUser';
import { useAppContext } from '../../utils/context';

const TEMP_SRC = 'https://cdn.arcyvilk.com/mhgo/misc/question.svg';

export const HomeView = () => {
  const { isTutorialDummyKilled } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { userId } = useMe();
  const { isFinishedTutorial } = useUserTutorial(userId!);

  const onEquipmentClick = () => navigate('/equipment');
  const onItemsClick = () => setIsModalOpen(true);
  const onPaintballClick = () => navigate('/paintball');
  const onYouClick = () => navigate('/you');
  const onShopClick = () => navigate('/shop');
  const onQuestClick = () => navigate('/quest');

  return (
    <div className={s.homeView}>
      {!isFinishedTutorial && (
        <>
          {!isTutorialDummyKilled ? (
            <Tutorial stepFrom="part1_start" stepTo="part1_end" />
          ) : (
            <Tutorial stepFrom="part4_start" stepTo="part4_end" />
          )}
        </>
      )}
      <Map />
      <div className={s.actions}>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
            <QuickUseModal />
          </Modal>
        )}
        {isFinishedTutorial && (
          <>
            <div className={s.actions__top}>
              <ActionButton icon="Face" onClick={onYouClick} />
              <ActionButton icon="Armory" onClick={onEquipmentClick} />
              <ActionButton icon="Paintball" onClick={onPaintballClick} />
              <ActionButton icon="Potion" onClick={onItemsClick} />
              <ActionButton icon="Shop" onClick={onShopClick} />
            </div>
            <QuestButton onClick={onQuestClick} />
          </>
        )}
      </div>
    </div>
  );
};

type ActionButtonProps = {
  icon: IconType;
  onClick: () => void;
};
const ActionButton = ({ icon, onClick }: ActionButtonProps) => {
  const { playSound } = useSounds(undefined);

  const onButtonClick = () => {
    playSound(SoundSE.CLICK);
    onClick();
  };

  return (
    <button className={s.actionButton} onClick={onButtonClick}>
      <Icon icon={icon} size={Size.TINY} />
    </button>
  );
};

const QuestButton = ({ onClick }: { onClick: () => void }) => {
  const { playSound } = useSounds(undefined);

  const onButtonClick = () => {
    playSound(SoundSE.CLICK);
    onClick();
  };

  return (
    <button className={s.button} onClick={onButtonClick}>
      <img className={s.button__image} src={TEMP_SRC} />
      <div className={s.button__desc}>
        <h2 className={s.button__title}>A Royal Audience with Rathian</h2>
        <p className={s.button__subtitle}>
          Chapter 9: Bright Lights and Beasts
        </p>
      </div>
      <img className={s.button__image} src={TEMP_SRC} />
    </button>
  );
};

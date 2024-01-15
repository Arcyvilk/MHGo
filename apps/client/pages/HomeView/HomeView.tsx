import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Icon,
  IconType,
  Modal,
  QueryBoundary,
  SoundSE,
  addCdnUrl,
  modifiers,
  useSounds,
} from '@mhgo/front';
import { Size } from '@mhgo/front';

import { Tutorial } from '../../containers';
import { useTutorialProgress } from '../../hooks/useTutorial';
import { useQuestsStory } from '../../hooks/useQuests';
import { useAppContext } from '../../utils/context';
import { QuickUseModal } from '../ModalView';
import { Map } from './Map';

import s from './HomeView.module.scss';

const TEMP_SRC = 'https://cdn.arcyvilk.com/mhgo/misc/question.svg';

export const HomeView = () => {
  const { isTutorialDummyKilled } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { isFinishedTutorialPartOne } = useTutorialProgress();

  const onEquipmentClick = () => navigate('/equipment');
  const onItemsClick = () => setIsModalOpen(true);
  const onPaintballClick = () => navigate('/paintball');
  const onYouClick = () => navigate('/you');
  const onShopClick = () => navigate('/shop');
  const onQuestClick = () => navigate('/quest');

  return (
    <div className={s.homeView}>
      {!isFinishedTutorialPartOne && (
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
        {isFinishedTutorialPartOne && (
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

type QuestButtonProps = { onClick: () => void };
const QuestButton = (props: QuestButtonProps) => (
  <QueryBoundary fallback={null}>
    <QuestButtonLoad {...props} />
  </QueryBoundary>
);

const QuestButtonLoad = ({ onClick }: QuestButtonProps) => {
  const { userQuestsWithDetails } = useQuestsStory();
  const { playSound } = useSounds(undefined);

  const mostRecentQuest = (userQuestsWithDetails.filter(q => !q.isClaimed) ??
    [])[0];
  const isDone =
    mostRecentQuest &&
    mostRecentQuest?.progress === mostRecentQuest?.maxProgress;

  const onButtonClick = () => {
    playSound(SoundSE.CLICK);
    onClick();
  };

  return (
    <button
      className={modifiers(s, 'button', { isDone })}
      onClick={onButtonClick}>
      {userQuestsWithDetails?.length ? (
        <>
          <img
            className={s.button__image}
            src={addCdnUrl(mostRecentQuest.img)}
          />
          <div className={s.button__desc}>
            <h2 className={s.button__title}>{mostRecentQuest.title}</h2>
            <p className={s.button__subtitle}>
              Chapter 1: Path to becoming a Master Hoarder
            </p>
          </div>
          <img className={s.button__image} src={TEMP_SRC} />
        </>
      ) : null}
    </button>
  );
};

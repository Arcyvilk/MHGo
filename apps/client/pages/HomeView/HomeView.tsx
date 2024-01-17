import { useState } from 'react';

import {
  Icon,
  IconType,
  Modal,
  QueryBoundary,
  SoundSE,
  addCdnUrl,
  modifiers,
  useNavigateWithScroll,
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

export const HomeView = () => {
  const { isTutorialDummyKilled } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { navigateWithoutScroll, navigateWithScroll } = useNavigateWithScroll();

  const { isFinishedTutorialPartOne } = useTutorialProgress();

  const onItemsClick = () => setIsModalOpen(true);
  const onYouClick = () => navigateWithoutScroll('/you');
  const onShopClick = () => navigateWithoutScroll('/shop');
  const onQuestClick = () => navigateWithoutScroll('/quest');
  const onEquipmentClick = () => navigateWithScroll('/equipment');
  const onPaintballClick = () => navigateWithoutScroll('/paintball');

  return (
    <div className={s.homeView}>
      <Tutorial
        stepFrom="part1_start"
        stepTo="part1_end"
        requirement={!isFinishedTutorialPartOne && !isTutorialDummyKilled}
      />
      <Tutorial
        stepFrom="part4_start"
        stepTo="part4_end"
        requirement={!isFinishedTutorialPartOne && isTutorialDummyKilled}
      />
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
          <img
            className={s.button__image}
            src={addCdnUrl('/misc/question.svg')}
          />
        </>
      ) : null}
    </button>
  );
};

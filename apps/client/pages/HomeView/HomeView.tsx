import { useEffect, useState } from 'react';

import {
  Icon,
  IconType,
  Loader,
  Modal,
  QueryBoundary,
  Skeleton,
  SoundSE,
  addCdnUrl,
  modifiers,
  useNavigateWithScroll,
  useSounds,
  useUpdateUserStoryQuestApi,
  useUserItemsApi,
} from '@mhgo/front';
import { Size } from '@mhgo/front';

import { Tutorial } from '../../containers';
import { useUser } from '../../hooks/useUser';
import { useTutorialProgress } from '../../hooks/useTutorial';
import { useQuestsStory } from '../../hooks/useQuests';
import { useAppContext } from '../../utils/context';
import { QuickUseModal } from '../ModalView';
import { Map } from './Map';

import s from './HomeView.module.scss';

export const HomeView = () => (
  <QueryBoundary fallback={<Loader fullScreen />}>
    <Load />
  </QueryBoundary>
);

const Load = () => {
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
            <QueryBoundary fallback={<SkeletonQuestButton />}>
              <LoadQuestButton onClick={onQuestClick} />
            </QueryBoundary>
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

const SkeletonQuestButton = () => (
  <div className={s.button}>
    <Skeleton width="100%" height="5rem" />
  </div>
);

type QuestButtonProps = { onClick: () => void };
const LoadQuestButton = ({ onClick }: QuestButtonProps) => {
  const { userQuestsWithDetails } = useQuestsStory();
  const { playSound } = useSounds(undefined);

  useUserQuestItems();

  const mostRecentQuest = (userQuestsWithDetails.filter(q => !q.isClaimed) ??
    [])[0];
  const isDone =
    mostRecentQuest &&
    mostRecentQuest?.progress === mostRecentQuest?.maxProgress;

  const noQuestActive = !mostRecentQuest;

  const onButtonClick = () => {
    playSound(SoundSE.CLICK);
    onClick();
  };

  if (noQuestActive)
    return (
      <button
        className={modifiers(s, 'button', { isDone })}
        onClick={onButtonClick}>
        {userQuestsWithDetails?.length ? (
          <>
            <Icon icon="Luck" size={Size.MEDIUM} />
            <div className={s.button__desc}>
              <h2 className={s.button__title}>No active quest</h2>
              <p className={s.button__subtitle}>Your backlog is empty!</p>
            </div>
          </>
        ) : null}
      </button>
    );
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

const useUserQuestItems = () => {
  const { userId } = useUser();
  const { userQuestsWithDetails } = useQuestsStory();
  const { data: userItems } = useUserItemsApi(userId);
  const { mutate: mutateUserStoryQuest } = useUpdateUserStoryQuestApi(userId);

  useEffect(() => {
    const questRequirements = userQuestsWithDetails
      ?.map(quest => {
        const { id, requirements, maxProgress, progress, isClaimed } = quest;
        if (isClaimed) return null;
        const userQuestItems = requirements
          .filter(requirement => requirement.type === 'item')
          .map(requirement => {
            const userItemAmount =
              userItems.find(userItem => userItem.id === requirement.id)
                ?.amount ?? 0;
            return userItemAmount;
          });
        const userProgress = userQuestItems[0];
        if (progress === userProgress) return null;
        // We can take first element, because currently there is only one requirement per array
        return { id, maxProgress, userProgress };
      })
      .filter(Boolean) as {
      id: string;
      maxProgress: number;
      userProgress: number;
    }[];

    // Update user quest progress
    questRequirements.forEach(quest => {
      const { id, userProgress } = quest;
      mutateUserStoryQuest({
        questId: id,
        progress: userProgress,
        isClaimed: false,
      });
    });
  }, []);
};

import { useState } from 'react';
import { Modal, QueryBoundary, Rays, modifiers } from '@mhgo/front';
import { useTutorial } from '../../hooks/useTutorial';

import s from './Tutorial.module.scss';
import { TutorialStep } from '@mhgo/types';
import { ModalAchievement } from '..';
import { AchievementId } from '../../hooks/useUpdateUserAchievement';

type TutorialProps = {
  stepFrom: string;
  stepTo: string;
};
export const Tutorial = (props: TutorialProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ stepFrom, stepTo }: TutorialProps) => {
  const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { currentStep, goToNextStep, isFinishedTutorialPartTwo, isFetched } =
    useTutorial(stepFrom, stepTo, setIsModalAchievementOpen);

  const nextStep = () => {
    goToNextStep(() => {
      setIsOpen(false);
    });
  };

  const isCentered = currentStep?.img || currentStep?.text;

  return (
    <>
      <ModalAchievement
        achievementId={AchievementId.TUTORIAL}
        isOpen={isModalAchievementOpen}
        setIsOpen={setIsModalAchievementOpen}
      />
      {!isFinishedTutorialPartTwo && isFetched && currentStep && (
        <Modal
          isTransparent
          isHighModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onClose={nextStep}>
          <div className={modifiers(s, 'tutorial', { isCentered })}>
            {currentStep.effects === 'rays' && <Rays />}
            <Spotlight currentStep={currentStep} />
            <Companion currentStep={currentStep} />
            <InfoDialog currentStep={currentStep} />
          </div>
        </Modal>
      )}
    </>
  );
};

const InfoDialog = ({ currentStep }: { currentStep: TutorialStep }) => {
  if (!currentStep.img && !currentStep.text) return null;
  return (
    <div className={s.tutorial__infoDialog}>
      {currentStep.img && (
        <img className={s.tutorial__infoImg} src={currentStep.img} />
      )}
      {currentStep.text && (
        <div className={s.tutorial__infoText}>{currentStep.text}</div>
      )}
    </div>
  );
};

const Companion = ({ currentStep }: { currentStep: TutorialStep }) => {
  if (!currentStep.companionImg) return null;
  return (
    <>
      <div className={s.tutorial__bubble}>{currentStep.companionSpeech}</div>
      <img className={s.tutorial__guide} src={currentStep.companionImg} />
    </>
  );
};

const Spotlight = ({ currentStep }: { currentStep: TutorialStep }) => {
  if (!currentStep.spotlight) return null;

  const top = currentStep.spotlight[0];
  const left = currentStep.spotlight[1];
  const width = currentStep.spotlight[2];
  const height =
    currentStep.spotlightShape === 'rectangle'
      ? currentStep.spotlight[3]
      : currentStep.spotlight[2];
  const borderRadius =
    currentStep.spotlightShape === 'circle' ? currentStep.spotlight[2] : 0;

  return (
    <div
      className={s.tutorial__spotlight}
      style={{ position: 'absolute', top, left, width, height, borderRadius }}
    />
  );
};

import { useState } from 'react';
import { Modal, QueryBoundary, Rays, modifiers } from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';
import { useUserTutorial } from '../../hooks/useUser';

import s from './Tutorial.module.scss';
import { TutorialStep } from '@mhgo/types';

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
  const [isOpen, setIsOpen] = useState(true);
  const { userId } = useMe();

  const { currentStep, goToNextStep, isFinishedTutorial, isFetched } =
    useUserTutorial(userId!, stepFrom, stepTo);

  const nextStep = () => {
    goToNextStep(() => {
      setIsOpen(false);
    });
  };

  const isCentered = currentStep?.img || currentStep?.text;

  if (!isFetched || isFinishedTutorial) return null;
  if (!currentStep) return null;
  return (
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

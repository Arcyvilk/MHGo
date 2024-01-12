import { useState } from 'react';
import { Modal, QueryBoundary } from '@mhgo/front';

import { useAppContext } from '../../utils/context';
import { useMe } from '../../hooks/useAuth';
import { useUserTutorial } from '../../hooks/useUser';

import s from './Tutorial.module.scss';

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

  if (!isFetched || isFinishedTutorial) return null;
  if (!currentStep) return null;
  return (
    <Modal
      isTransparent
      isHighModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={nextStep}>
      <div className={s.tutorial}>
        {currentStep.spotlight && (
          <div
            className={s.tutorial__spotlight}
            style={{
              position: 'absolute',
              top: currentStep.spotlight[0],
              left: currentStep.spotlight[1],
              width: currentStep.spotlight[2],
              height:
                currentStep.spotlightShape === 'rectangle'
                  ? currentStep.spotlight[3]
                  : currentStep.spotlight[2],
              borderRadius:
                currentStep.spotlightShape === 'circle'
                  ? currentStep.spotlight[2]
                  : 0,
            }}
          />
        )}
        {currentStep.companionImg && (
          <>
            <div className={s.tutorial__bubble}>
              {currentStep.companionSpeech}
            </div>
            <img className={s.tutorial__guide} src={currentStep.companionImg} />
          </>
        )}
      </div>
    </Modal>
  );
};

// const getTutorial = (companion: Companion): TutorialStep[] => [
//   // HOME VIEW PART - 0-3
//   {
//     id: 'start',
//     companionImg: companion.img_idle,
//     companionSpeech: 'Hello there master!',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'cool_tutorial',
//     companionImg: companion.img_happy,
//     companionSpeech: 'This is a very cool tutorial!',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'awesome',
//     companionImg: companion.img_happy,
//     companionSpeech: 'Look how awesome it is!',
//     spotlight: ['calc(50% - 50px)', 'calc(50% - 50px)', '100px'],
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'goodbye_1',
//     companionImg: companion.img_surprised,
//     companionSpeech: 'Thats it for now, goodbye!',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: true,
//   },
//   // PREPARE VIEW PART - 4-6
//   {
//     id: 'slime',
//     companionImg: companion.img_happy,
//     companionSpeech:
//       "This is a Training Slime - it won't hurt you, and you can test your combat abilities on it.",
//     spotlight: ['calc(50% - 300px)', 'calc(50% - 300px)', '600px'],
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'murder',
//     companionImg: companion.img_surprised,
//     companionSpeech: 'MURDER HIM!!!',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'woof',
//     companionImg: companion.img_surprised,
//     companionSpeech: 'Woof :3',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: true,
//   },
//   // FIGHT VIEW PART - 7-9
//   {
//     id: 'tap_to_hit',
//     companionImg: companion.img_idle,
//     companionSpeech: 'Tap to hit! Woof.',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'attack_timer',
//     companionImg: companion.img_idle,
//     companionSpeech:
//       'Top left corner shows the time until the next monster attack.',
//     spotlight: ['-80px', '-80px', '200px'],
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: true,
//   },
//   {
//     id: 'flee',
//     companionImg: companion.img_idle,
//     companionSpeech:
//       "If you're sure the next attack would kill you, you can quickly flee by clicking the button at the bottom.",
//     spotlight: ['calc(100% - 180px)', 'calc(50% - 150px)', '300px'],
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: true,
//   },
//   // FINAL VIEW PART - 10-12
//   {
//     id: 'congratulations',
//     companionImg: companion.img_surprised,
//     companionSpeech:
//       'Congratulations! You mercilessly murdered the Training Slime.',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'last_specimen',
//     companionImg: companion.img_surprised,
//     companionSpeech:
//       "I'll let you know that this was the last specimen of its family and will NEVER respawn. You officially commited a genocide.",
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: false,
//   },
//   {
//     id: 'goodbye_2',
//     companionImg: companion.img_surprised,
//     companionSpeech: 'Yay for murder!',
//     spotlight: null,
//     spotlightShape: null,
//     img: null,
//     text: null,
//     effects: null,
//     closeNext: true,
//   },
// ];

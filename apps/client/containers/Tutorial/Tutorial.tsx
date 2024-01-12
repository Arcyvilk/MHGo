import { useMemo, useState } from 'react';
import {
  Modal,
  QueryBoundary,
  useCompanionApi,
  useSettingsApi,
} from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';
import { useUserTutorial } from '../../hooks/useUser';

import s from './Tutorial.module.scss';
import { Companion } from '@mhgo/types';
import { useAppContext } from '../../utils/context';

type TutorialProps = {
  stepFrom: number;
  stepTo: number;
};
export const Tutorial = (props: TutorialProps) => (
  <QueryBoundary fallback={null}>
    <Load {...props} />
  </QueryBoundary>
);

const Load = ({ stepFrom, stepTo }: TutorialProps) => {
  const { tutorialStep: step, setTutorialStep } = useAppContext();
  const { userId } = useMe();
  const { setting = '' } = useSettingsApi<string>('default_companion', '');
  const { isFinishedTutorial } = useUserTutorial(userId!);
  const { data: companion, isFetched } = useCompanionApi(setting);

  const [isOpen, setIsOpen] = useState(true);

  const tutorial = useMemo(() => {
    if (isFetched && companion) return getTutorial(companion);
    else return [];
  }, [isFetched, companion]);

  const finishTutorial = () => {
    alert('Tutorial finished');
  };

  const nextStep = () => {
    if (step >= stepFrom) {
      setTutorialStep(step + 1);
      return;
    }
    if (!tutorial[step + 1]) {
      finishTutorial();
      setIsOpen(false);
      return;
    }
    if (tutorial[step].closeNext || step >= stepTo) {
      setTutorialStep(step + 1);
      setIsOpen(false);
      return;
    }
  };

  if (!isFetched || isFinishedTutorial || step < stepFrom || step > stepTo)
    return null;
  return (
    <Modal
      isTransparent
      isHighModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={nextStep}>
      <div className={s.tutorial}>
        {tutorial[step]?.spotlight && (
          <div
            className={s.tutorial__spotlight}
            style={{
              position: 'absolute',
              top: tutorial[step]?.spotlight![0],
              left: tutorial[step]?.spotlight![1],
              width: tutorial[step]?.spotlight![2],
              height: tutorial[step]?.spotlight![2],
              borderRadius: tutorial[step]?.spotlight![2],
            }}
          />
        )}
        <div className={s.tutorial__bubble}>{tutorial[step].text}</div>
        <img className={s.tutorial__guide} src={tutorial[step].img} />
      </div>
    </Modal>
  );
};

type TutorialStep = {
  img: string;
  text: string;
  closeNext: boolean;
  spotlight: [string, string, string] | null;
};
const getTutorial = (companion: Companion): TutorialStep[] => [
  // HOME VIEW PART - 0-3
  {
    img: companion.img_idle,
    text: 'Hello there master!',
    spotlight: null,
    closeNext: false,
  },
  {
    img: companion.img_happy,
    text: 'This is a very cool tutorial!',
    spotlight: null,
    closeNext: false,
  },
  {
    img: companion.img_happy,
    text: 'Look how awesome it is!',
    spotlight: ['calc(50% - 50px)', 'calc(50% - 50px)', '100px'],
    closeNext: false,
  },
  {
    img: companion.img_surprised,
    text: 'Thats it for now, goodbye!',
    spotlight: null,
    closeNext: true,
  },
  // PREPARE VIEW PART - 4-6
  {
    img: companion.img_happy,
    text: "This is a Training Slime - it won't hurt you, and you can test your combat abilities on it.",
    spotlight: ['calc(50% - 300px)', 'calc(50% - 300px)', '600px'],
    closeNext: false,
  },
  {
    img: companion.img_surprised,
    text: 'MURDER HIM!!!',
    spotlight: null,
    closeNext: false,
  },
  {
    img: companion.img_surprised,
    text: 'Woof :3',
    spotlight: null,
    closeNext: true,
  },
  // FIGHT VIEW PART - 7-9
  {
    img: companion.img_idle,
    text: 'Tap to hit! Woof.',
    spotlight: null,
    closeNext: false,
  },
  {
    img: companion.img_idle,
    text: 'Top left corner shows the time until the next monster attack.',
    spotlight: ['-80px', '-80px', '200px'],
    closeNext: true,
  },
  {
    img: companion.img_idle,
    text: "If you're sure the next attack would kill you, you can quickly flee by clicking the button at the bottom.",
    spotlight: ['calc(100% - 180px)', 'calc(50% - 150px)', '300px'],
    closeNext: true,
  },
  // FINAL VIEW PART - 10-12
  {
    img: companion.img_surprised,
    text: 'Congratulations! You mercilessly murdered the Training Slime.',
    spotlight: null,
    closeNext: false,
  },
  {
    img: companion.img_surprised,
    text: "I'll let you know that this was the last specimen of its family and will NEVER respawn. You officially commited a genocide.",
    spotlight: null,
    closeNext: false,
  },
  {
    img: companion.img_surprised,
    text: 'Yay for murder!',
    spotlight: null,
    closeNext: true,
  },
];

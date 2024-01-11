import { useState } from 'react';
import { Modal } from '@mhgo/front';
import { useMe } from '../../hooks/useAuth';
import { useUserTutorial } from '../../hooks/useUser';

import s from './Tutorial.module.scss';

export const Tutorial = () => {
  const { userId } = useMe();
  const { isFinishedTutorial } = useUserTutorial(userId!);
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (tutorial[step].closeNext || !tutorial[step + 1]) {
      setIsOpen(false);
    } else setStep(step + 1);
  };

  if (isFinishedTutorial) return null;
  return (
    <Modal
      isTransparent
      isHighModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={nextStep}>
      <div className={s.tutorial}>
        <div className={s.tutorial__bubble}>{tutorial[step].text}</div>
        <img className={s.tutorial__guide} src={tutorial[step].img} />
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
const tutorial: TutorialStep[] = [
  {
    img: 'https://cdn.arcyvilk.com/mhgo/misc/dummy.gif',
    text: 'Hello there master!',
    spotlight: null,
    closeNext: false,
  },
  {
    img: 'https://cdn.arcyvilk.com/mhgo/misc/dummy.gif',
    text: 'This is a very cool tutorial!',
    spotlight: null,
    closeNext: false,
  },
  {
    img: 'https://cdn.arcyvilk.com/mhgo/misc/dummy.gif',
    text: 'Look how awesome it is!',
    spotlight: ['calc(50% - 50px)', 'calc(50% - 50px)', '100px'],
    closeNext: false,
  },
  {
    img: 'https://cdn.arcyvilk.com/mhgo/misc/dummy.gif',
    text: 'Thats it for now, goodbye!',
    spotlight: ['calc(50% - 50px)', 'calc(50% - 50px)', '100px'],
    closeNext: true,
  },
];

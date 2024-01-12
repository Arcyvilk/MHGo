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

  const nextStep = () => {
    setTutorialStep(step + 1);
    if (tutorial[step].closeNext || !tutorial[step + 1] || step >= stepTo) {
      setIsOpen(false);
    }
  };

  if (!isFetched || isFinishedTutorial) return null;
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
const getTutorial = (companion: Companion): TutorialStep[] => [
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
    closeNext: false,
  },
  {
    img: companion.img_happy,
    text: 'Attack this dude!',
    spotlight: ['calc(50% - 250px)', 'calc(50% - 250px)', '500px'],
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
    closeNext: false,
  },
  {
    img: companion.img_surprised,
    text: 'Congratulations!!!',
    spotlight: null,
    closeNext: false,
  },
];

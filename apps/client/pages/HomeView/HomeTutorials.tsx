import { Tutorial } from '../../containers';
import { useTutorialProgress } from '../../hooks/useTutorial';
import { useAppContext } from '../../utils/context';

export const HomeTutorials = () => {
  const { isTutorialDummyKilled } = useAppContext();
  const {
    isFinishedTutorialPartOne,
    isFinishedTutorialPartTwo,
    getIsFinishedTutorialPart,
  } = useTutorialProgress();

  return (
    <>
      <Tutorial
        stepFrom="part1_start"
        stepTo="part1_end"
        requirement={
          !isFinishedTutorialPartOne && !isTutorialDummyKilled.isKilled
        }
      />
      <Tutorial
        stepFrom="part4_start"
        stepTo="part4_end"
        requirement={
          !isFinishedTutorialPartTwo && isTutorialDummyKilled.isKilled
        }
      />
      <Tutorial
        stepFrom="part6_start"
        stepTo="part6_end"
        requirement={!getIsFinishedTutorialPart('part6_end')}
      />
      <Tutorial
        stepFrom="part7_start"
        stepTo="part7_end"
        requirement={!getIsFinishedTutorialPart('part7_end')}
      />
      <Tutorial
        stepFrom="part8_start"
        stepTo="part8_end"
        requirement={!getIsFinishedTutorialPart('part8_end')}
      />
      <Tutorial
        stepFrom="part9_start"
        stepTo="part9_end"
        requirement={!getIsFinishedTutorialPart('part9_end')}
      />
      <Tutorial
        stepFrom="part10_start"
        stepTo="part10_end"
        requirement={!getIsFinishedTutorialPart('part10_end')}
      />
      <Tutorial
        stepFrom="part11_start"
        stepTo="part11_end"
        requirement={!getIsFinishedTutorialPart('part11_end')}
      />
    </>
  );
};

import { Tutorial } from '../../containers';
import { useTutorialProgress } from '../../hooks/useTutorial';
import { useAppContext } from '../../utils/context';

export const HomeTutorials = () => {
  const { isTutorialDummyKilled } = useAppContext();
  const {
    isFinishedTutorialPartOne,
    isFinishedTutorialPartTwo,
    getIsFinishedTutorialPartOptional,
  } = useTutorialProgress();
  return (
    <>
      <Tutorial
        stepFrom="part1_start"
        stepTo="part1_end"
        requirement={!isFinishedTutorialPartOne && !isTutorialDummyKilled}
      />
      <Tutorial
        stepFrom="part4_start"
        stepTo="part4_end"
        requirement={!isFinishedTutorialPartTwo && isTutorialDummyKilled}
      />
      <Tutorial
        stepFrom="part6_start"
        stepTo="part6_end"
        requirement={!getIsFinishedTutorialPartOptional('part6_end')}
      />
      <Tutorial
        stepFrom="part7_start"
        stepTo="part7_end"
        requirement={!getIsFinishedTutorialPartOptional('part7_end')}
      />
      <Tutorial
        stepFrom="part8_start"
        stepTo="part8_end"
        requirement={!getIsFinishedTutorialPartOptional('part8_end')}
      />
      <Tutorial
        stepFrom="part9_start"
        stepTo="part9_end"
        requirement={!getIsFinishedTutorialPartOptional('part9_end')}
      />
      <Tutorial
        stepFrom="part10_start"
        stepTo="part10_end"
        requirement={!getIsFinishedTutorialPartOptional('part10_end')}
      />
      <Tutorial
        stepFrom="part11_start"
        stepTo="part11_end"
        requirement={!getIsFinishedTutorialPartOptional('part11_end')}
      />
    </>
  );
};

import { useMemo, useEffect } from 'react';
import {
  TutorialPart,
  useCompanionApi,
  useSettingsApi,
  useTutorialApi,
  useUserAchievementsApi,
} from '@mhgo/front';

import { useAppContext } from '../utils/context';
import { useUser } from './useUser';
import {
  AchievementId,
  useUpdateUserAchievement,
} from './useUpdateUserAchievement';

import { Companion, TutorialStep } from '@mhgo/types';

export const USER_NAME = '-';

export const useTutorial = (
  stepFrom: string,
  stepTo: string,
  setIsModalAchievementOpen: (isModalAchievementOpen: boolean) => void,
) => {
  useTutorialLoad();
  const { tutorialStep: step, setTutorialStep } = useAppContext();

  const { setting = '' } = useSettingsApi<string>('default_companion', '');
  const { data: companion, isFetched: isCompanionFetched } =
    useCompanionApi(setting);
  const { data: tutorialPart, isFetched: isTutorialFetched } = useTutorialApi(
    stepFrom,
    stepTo,
  );
  const { insertCompanionToTutorial } = useTutorialCompanion(tutorialPart);

  const tutorial = useMemo(() => {
    if (isCompanionFetched && companion)
      return insertCompanionToTutorial(companion);
    else return tutorialPart.tutorial;
  }, [isCompanionFetched, companion]);

  const currentStep = useMemo(() => {
    const curr = tutorial.find(t => t.id === step);
    return curr ?? null;
  }, [tutorial, step]);

  const { unlockAchievementIfApplicable } = useTutorialAchievement(
    currentStep,
    setIsModalAchievementOpen,
  );
  const { isFinishedTutorialPartOne, isFinishedTutorialPartTwo } =
    useTutorialProgress();

  const goToNextStep = (onEnd: () => void) => {
    const currStepIndex = tutorial.findIndex(t => t.id === step);
    const nextStep = tutorial[currStepIndex + 1];

    unlockAchievementIfApplicable();

    // This part of tutorial still has next step
    if (nextStep) setTutorialStep(nextStep.id);
    // This part of tutorial has finished...
    else {
      // ...but more is coming soon
      if (tutorialPart.nextPartId) setTutorialStep(tutorialPart.nextPartId);
      // And this happens if tutorial finished altogether!
      else onEnd();
    }
  };

  return {
    tutorial,
    currentStep,
    goToNextStep,
    isFinishedTutorialPartOne,
    isFinishedTutorialPartTwo,
    isFetched: isCompanionFetched && isTutorialFetched,
  };
};

/**
 * INITIAL LOADING OF TUTORIAL
 */
const useTutorialLoad = () => {
  const { tutorialStep, setTutorialStep } = useAppContext();
  const { isFinishedTutorialPartOne, isFinishedTutorialPartTwo, isFetched } =
    useTutorialProgress();

  useEffect(() => {
    if (isFetched && tutorialStep === null) {
      if (isFinishedTutorialPartOne && !isFinishedTutorialPartTwo)
        setTutorialStep('part5_start');
      if (!isFinishedTutorialPartOne) setTutorialStep('part1_start');
    }
  }, [isFetched]);
};

/**
 * HANDLE TUTORIAL PROGRESS
 * FIRST PART OF TUTORIAL UNLOCKS UI
 * SECOND PART OF TUTORIAL IS JUST INFORMATIVE
 */
export const useTutorialProgress = () => {
  const { userId } = useUser();
  const { data: userAchievements, isFetched } = useUserAchievementsApi(userId);
  const achievement = userAchievements.find(
    achievement => achievement.achievementId === AchievementId.TUTORIAL,
  );

  const isFinishedTutorialPartOne = useMemo(
    () => achievement && achievement?.progress >= 1,
    [isFetched, userAchievements],
  );
  const isFinishedTutorialPartTwo = useMemo(
    () => achievement && achievement?.progress >= 2,
    [isFetched, userAchievements],
  );

  return { isFinishedTutorialPartOne, isFinishedTutorialPartTwo, isFetched };
};

/**
 * ADD USER SELECTED COMPANION INTO THE TUTORIAL
 */
const useTutorialCompanion = (tutorialPart: TutorialPart) => {
  const { userName } = useUser();
  const insertCompanionToTutorial = (c: Companion) => {
    return tutorialPart.tutorial.map((step: TutorialStep) => ({
      ...step,
      ...(step.companionSpeech
        ? {
            companionSpeech: step.companionSpeech
              .replace(/PLAYER_NAME/g, userName)
              .replace(/COMPANION_NAME/g, c.name)
              .replace(/COMPANION_SPECIES/g, c.species)
              // TODO Think of some cool name for him
              .replace(/FINAL_BOSS_NAME/g, 'Chief Hoarding Officer'),
          }
        : {}),
      ...(step.companionImg
        ? {
            companionImg: c[step.companionImg as keyof Companion],
          }
        : {}),
    }));
  };

  return { insertCompanionToTutorial };
};

/**
 * HANDLE TUTORIAL RELATED ACHIEVEMENTS
 */
const useTutorialAchievement = (
  currentStep: TutorialStep | null,
  setIsModalAchievementOpen: (isModalAchievementOpen: boolean) => void,
) => {
  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();

  const isAchievementUnlocked = useMemo(() => {
    const { unlockedNewAchievement: unlockedTutorial } =
      getIsAchievementUnlocked(AchievementId.TUTORIAL);
    return unlockedTutorial;
  }, [isAchievementUpdateSuccess]);

  useEffect(() => {
    if (isAchievementUnlocked) setIsModalAchievementOpen(true);
  }, [isAchievementUnlocked]);

  const unlockAchievementIfApplicable = () => {
    if (!currentStep?.closeNext) return;
    else mutate({ achievementId: AchievementId.TUTORIAL, progress: 1 });
  };

  return { unlockAchievementIfApplicable };
};

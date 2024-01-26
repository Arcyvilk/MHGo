import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Loader,
  Modal,
  QueryBoundary,
  useUserConsumeItemsApi,
  useUserItemsApi,
} from '@mhgo/front';

import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../hooks/useUpdateUserAchievement';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';
import { useUser } from '../../hooks/useUser';
import { ModalAchievement } from '../../containers';

import s from './ModalResult.module.scss';
import { ITEM_ID_BLOOD_BAG } from '../../utils/consts';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onForfeit: () => void;
  onRevive: () => void;
  revivalAttempts: number;
  setRevivalAttempts: (revivalAttempts: number) => void;
};
export const ModalFailure = ({ isOpen, setIsOpen, ...props }: ModalProps) => (
  <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => {}}>
    <div className={s.result}>
      <h1 className={s.result__title}>Failure!</h1>
      <QueryBoundary fallback={<Loader />}>
        <Load {...props} />
      </QueryBoundary>
    </div>
  </Modal>
);

const Load = ({
  onForfeit,
  onRevive,
  revivalAttempts,
  setRevivalAttempts,
}: Omit<ModalProps, 'isOpen' | 'setIsOpen'>) => {
  const { monster, isDummy } = useMonsterMarker();
  const { canRevive, onConsumeReviveItem } = useCanPlayerRevive(
    revivalAttempts,
    setRevivalAttempts,
  );

  const {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  } = useDyingAchievements(monster?.id);

  const onReviveClick = () => {
    onConsumeReviveItem();
    onRevive();
  };

  useEffect(() => {
    if (isDummy) updateAchievement();
  }, []);

  return (
    <>
      {isModalAchievementOpen && (
        <ModalAchievement
          achievementId={achievementId}
          isOpen={isModalAchievementOpen}
          setIsOpen={setIsModalAchievementOpen}
        />
      )}
      <div className={s.result__content}>
        Unfortunately, you got severely injured and bled to death. RIP.
      </div>
      {canRevive && (
        <Button
          label={'Perform emergency blood transfusion (1 attempt left)'}
          variant={Button.Variant.ACTION}
          onClick={onReviveClick}
          simple
        />
      )}
      <Button
        label="I acknowledge my noobness ;-;"
        onClick={onForfeit}
        simple
      />
    </>
  );
};

const useDyingAchievements = (monsterId: string) => {
  const [achievementId, setAchievementId] = useState<string | null>();
  const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);
  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();

  const isAchievementUnlocked = useMemo(() => {
    const { unlockedNewAchievement: unlockedRevenge } =
      getIsAchievementUnlocked(AchievementId.SWEET_REVENGE);
    return unlockedRevenge;
  }, [isAchievementUpdateSuccess]);

  const updateAchievement = () => {
    if (monsterId === 'dummy') {
      setAchievementId(AchievementId.SWEET_REVENGE);
      mutate({ achievementId: AchievementId.SWEET_REVENGE, progress: 1 });
    }
  };

  useEffect(() => {
    if (isAchievementUnlocked) setIsModalAchievementOpen(true);
  }, [isAchievementUnlocked]);

  return {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  };
};

const useCanPlayerRevive = (
  revivalAttempts: number,
  setRevivalAttempts: (revivalAttempts: number) => void,
) => {
  const { userId } = useUser();
  const { data: userItems } = useUserItemsApi(userId);
  const { mutate: mutateConsumeItem } = useUserConsumeItemsApi(userId);

  const canRevive = useMemo(() => {
    // Check all things that make user not revivable
    if (revivalAttempts <= 0) return false;
    const hasBloodBag = userItems.find(item => item.id === ITEM_ID_BLOOD_BAG);
    if (!hasBloodBag) return false;

    // Otherwise, can be revived
    return true;
  }, [userItems]);

  const onConsumeReviveItem = () => {
    setRevivalAttempts(revivalAttempts - 1);
    mutateConsumeItem([{ itemId: ITEM_ID_BLOOD_BAG, amountUsed: 1 }]);
  };

  return { canRevive, onConsumeReviveItem };
};

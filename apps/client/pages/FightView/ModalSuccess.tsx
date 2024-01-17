import { useEffect, useState, useCallback, useMemo } from 'react';

import { CurrencyType } from '@mhgo/types';
import {
  Item,
  Button,
  Loader,
  Modal,
  QueryBoundary,
  addCdnUrl,
  useMonsterMarkerDropsApi,
  useUpdateUserWealthApi,
  useUserLoadoutApi,
  Icon,
  Size,
  Rain,
} from '@mhgo/front';

import { ModalLevelUp } from './ModalLevelUp';
import { ModalAchievement } from '../../containers';
import { useAppContext } from '../../utils/context';
import { useUser } from '../../hooks/useUser';
import { useUserLevelUp } from '../../hooks/useUserLevelUp';
import {
  AchievementId,
  useUpdateUserAchievement,
} from '../../hooks/useUpdateUserAchievement';
import { useMonsterMarker } from '../../hooks/useMonsterMarker';

import s from './ModalResult.module.scss';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};
export const ModalSuccess = ({ isOpen, setIsOpen, onClose }: ModalProps) => (
  <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => {}}>
    <div className={s.result}>
      <h1 className={s.result__title}>Success!</h1>
      <QueryBoundary fallback={<Loader />}>
        <Load onClose={onClose} />
      </QueryBoundary>
    </div>
  </Modal>
);

const Load = ({ onClose }: { onClose: () => void }) => {
  const params = new URLSearchParams(location.search);
  const markerId = params.get('id') ?? '';
  const level = params.get('level') ?? '0';

  const { setIsTutorialDummyKilled } = useAppContext();
  const [isModalLevelUpOpen, setIsModalLevelUpOpen] = useState(false);
  const [isLootRedeemed, setIsLootRedeemed] = useState(false);
  const { userId } = useUser();
  const { monster, isTutorial, isDummy } = useMonsterMarker();
  const {
    data: drops = [],
    mutate: mutateUserDrops,
    isSuccess,
  } = useMonsterMarkerDropsApi(userId);
  const { mutate: mutateUserExp, didLevelUp, levels } = useUserLevelUp(userId);
  const {
    data: { luckyDrop },
    mutate: mutateUserWealth,
  } = useUpdateUserWealthApi(userId);

  const {
    achievementId,
    updateAchievement,
    isModalAchievementOpen,
    setIsModalAchievementOpen,
  } = useKillingAchievements(monster?.id);

  const expChange = Number(level) * monster.baseExp;
  const wealthChange: { [key in CurrencyType]?: number } = {};
  monster.baseWealth.forEach(currency => {
    wealthChange[currency.type] = currency.amount;
  });

  const redeemLoot = useCallback(() => {
    if (isLootRedeemed || isTutorial || isDummy) return;
    setIsLootRedeemed(true);
    mutateUserWealth(wealthChange);
    mutateUserExp({ expChange });
    mutateUserDrops({
      markerId,
      monsterLevel: Number(level),
    });
  }, [isLootRedeemed]);

  useEffect(() => {
    if (isTutorial) setIsTutorialDummyKilled(true);
    redeemLoot();
    updateAchievement();
  }, []);

  useEffect(() => {
    if (didLevelUp) setIsModalLevelUpOpen(true);
  }, [didLevelUp]);

  const listOfDrops = drops.map(drop => {
    const data = {
      ...drop,
      img: addCdnUrl(drop.img),
      purchasable: false,
    };
    return <Item data={data} key={drop.id} />;
  });

  return (
    <div className={s.modalSuccess}>
      {luckyDrop && <Rain type="COIN" isRaining={true} />}
      {didLevelUp && (
        <ModalLevelUp
          levels={levels}
          isOpen={isModalLevelUpOpen}
          setIsOpen={setIsModalLevelUpOpen}
        />
      )}
      {isModalAchievementOpen && (
        <ModalAchievement
          achievementId={achievementId}
          isOpen={isModalAchievementOpen}
          setIsOpen={setIsModalAchievementOpen}
        />
      )}
      {!isTutorial && !isDummy && (
        <>
          <div className={s.result__misc}>
            <div>
              <span style={{ fontWeight: 900 }}>EXP:</span> +{expChange}
            </div>
            <div className={s.result__payment}>
              <span style={{ fontWeight: 900 }}>Money:</span>
              {Object.entries(wealthChange)
                .filter(([_, value]) => value > 0)
                .map(([key, value]) => (
                  <>
                    <span>+{value}</span>
                    <Icon
                      icon={key == 'base' ? 'Coin' : 'Paw'}
                      size={Size.MICRO}
                    />
                  </>
                ))}
            </div>
            {luckyDrop && (
              <div className={s.result__lucky}>
                <Icon icon="Luck" size={Size.MICRO} />
                <span style={{ fontWeight: 900 }}>You got lucky!</span>
                <span>+{luckyDrop}</span>
                <Icon icon="Coin" size={Size.MICRO} />
              </div>
            )}
          </div>
          <p className={s.result__desc}>Monster dropped the following items:</p>
          <div className={s.result__drops}>
            {isSuccess ? (
              listOfDrops?.length ? (
                listOfDrops
              ) : (
                "NOTHING! God damn it you're so unlucky ;-;"
              )
            ) : (
              <Loader />
            )}
          </div>
        </>
      )}
      <Button
        label={isTutorial || isDummy ? 'Yay!' : 'Claim'}
        onClick={onClose}
        simple
      />
    </div>
  );
};

const useKillingAchievements = (monsterId: string) => {
  const { userId } = useUser();
  const { data: userLoadout } = useUserLoadoutApi(userId);
  const [achievementId, setAchievementId] = useState<string | null>();
  const [isModalAchievementOpen, setIsModalAchievementOpen] = useState(false);
  const {
    mutate,
    getIsAchievementUnlocked,
    isSuccess: isAchievementUpdateSuccess,
  } = useUpdateUserAchievement();

  const isAchievementUnlocked = useMemo(() => {
    const { unlockedNewAchievement: unlocked2137 } = getIsAchievementUnlocked(
      AchievementId.HABEMUS_PAPAM,
    );
    const { unlockedNewAchievement: unlockedRage } = getIsAchievementUnlocked(
      AchievementId.PRIMAL_RAGE,
    );
    if (unlocked2137 || unlockedRage) return true;
    return false;
  }, [isAchievementUpdateSuccess]);

  const updateAchievement = () => {
    if (monsterId === 'babcianiath') {
      setAchievementId(AchievementId.HABEMUS_PAPAM);
      mutate({ achievementId: AchievementId.HABEMUS_PAPAM, progress: 1 });
    }
    if (monsterId === 'dummy') {
      setAchievementId(AchievementId.HEARTLESS_MURDERER);
      mutate({ achievementId: AchievementId.HEARTLESS_MURDERER, progress: 1 });
    }
    if (
      monsterId === 'dracolich' &&
      userLoadout.find(slot => slot.slot === 'weapon')?.itemId === 'bare_fist'
    ) {
      setAchievementId(AchievementId.PRIMAL_RAGE);
      mutate({ achievementId: AchievementId.PRIMAL_RAGE, progress: 1 });
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

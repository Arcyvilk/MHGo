import { useEffect, useMemo } from 'react';
import {
  Button,
  Item,
  LevelUpdate,
  Modal,
  Rays,
  useItemsApi,
  useMaterialsApi,
  useSettingsApi,
  useUpdateUserItemsApi,
} from '@mhgo/front';
import { LevelUpReward, Item as TItem } from '@mhgo/types';

import { DEFAULT_LEVEL_UP_REWARDS } from '../../utils/consts';
import { useUser } from '../../hooks/useUser';

import s from './ModalResult.module.scss';

type ModalProps = {
  levels?: LevelUpdate;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const ModalLevelUp = ({ levels, isOpen, setIsOpen }: ModalProps) => (
  <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
    <Rays />
    <div className={s.result}>
      <h1 className={s.result__title}>LEVEL UP!</h1>
      <div className={s.result__content}>Congratulations, you leveled up!</div>
      <Load levels={levels} setIsOpen={setIsOpen} />
    </div>
  </Modal>
);

const Load = ({ levels, setIsOpen }: Omit<ModalProps, 'isOpen'>) => {
  const { userId } = useUser();
  const { data: items } = useItemsApi();
  const { data: materials } = useMaterialsApi();
  const { mutate: mutateLevelUpRewards, isSuccess } =
    useUpdateUserItemsApi(userId);
  const { setting = [], isFetched } =
    useSettingsApi<LevelUpReward[]>('level_up_rewards');

  const getRewardsRaw = () => {
    const userLevelIsMultipleOfFive = (levels?.newLevel ?? 0) % 5 === 0;
    const levelUpReward =
      setting.find(level => level.level === levels?.newLevel)?.rewards ?? [];
    // If user's level has no rewards coded, just give 'em default rewards every 5 levels
    if (!levelUpReward.length && userLevelIsMultipleOfFive)
      return DEFAULT_LEVEL_UP_REWARDS;
    return levelUpReward;
  };

  const rewardsRaw = getRewardsRaw();

  const allRewards = useMemo(
    () =>
      rewardsRaw.map(r => {
        let reward;
        if (r.type === 'item') reward = items.find(i => i.id === r.id) ?? {};
        if (r.type === 'material')
          reward = materials.find(i => i.id === r.id) ?? {};
        return { ...reward, amount: r.amount } as TItem & { amount: number };
      }),
    [items, materials, isSuccess, isFetched],
  );

  useEffect(() => {
    mutateLevelUpRewards(rewardsRaw);
  }, []);

  return (
    <>
      <div className={s.result__update}>
        <span className={s.result__level}>{levels?.oldLevel ?? '-'}</span>
        <span className={s.result__level}>→</span>
        <span className={s.result__level}>{levels?.newLevel ?? '-'}</span>
      </div>
      {isSuccess && allRewards?.length > 0 ? (
        <>
          <div className={s.result__content}>Your rewards:</div>
          <div className={s.result__drops}>
            {allRewards.map(reward => (
              <Item data={{ ...reward, purchasable: false }} />
            ))}
          </div>
        </>
      ) : null}
      <Button label="Yay!" onClick={() => setIsOpen(false)} simple />
    </>
  );
};

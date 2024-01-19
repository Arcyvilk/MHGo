import { useEffect, useMemo } from 'react';
import {
  Button,
  Item,
  LevelUpdate,
  Modal,
  Rays,
  useItemsApi,
  useUpdateUserItemsApi,
} from '@mhgo/front';
import { Item as TItem } from '@mhgo/types';

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
  const { mutate: mutateLevelUpRewards, isSuccess } =
    useUpdateUserItemsApi(userId);

  const rewardsRaw = [{ itemId: 'potion', amount: 5 }];
  const rewards = useMemo(
    () =>
      rewardsRaw.map(reward => {
        const item = items.find(i => i.id === reward.itemId) ?? {};
        return { ...item, amount: reward.amount } as TItem & { amount: number };
      }),
    [items, isSuccess],
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
      {isSuccess && rewards?.length > 0 ? (
        <>
          <div className={s.result__content}>Your rewards:</div>
          {rewards.map(reward => (
            <Item data={{ ...reward, purchasable: false }} />
          ))}
        </>
      ) : null}
      <Button label="Yay!" onClick={() => setIsOpen(false)} simple />
    </>
  );
};

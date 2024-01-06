import {
  Button,
  Item,
  LevelUpdate,
  Modal,
  Rays,
  useItemsApi,
} from '@mhgo/front';

import s from './ModalResult.module.scss';

type ModalProps = {
  levels?: LevelUpdate;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export const ModalLevelUp = ({ levels, isOpen, setIsOpen }: ModalProps) => {
  const { data: items } = useItemsApi();
  // TODO implement real rewards
  const fakeRewards = items[0];
  const rewards = [fakeRewards];

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Rays />
      <div className={s.result}>
        <h1 className={s.result__title}>LEVEL UP!</h1>
        <div className={s.result__content}>
          Congratulations, you leveled up!
        </div>
        <div className={s.result__update}>
          <span className={s.result__level}>{levels?.oldLevel ?? '-'}</span>
          <span className={s.result__level}>→</span>
          <span className={s.result__level}>{levels?.newLevel ?? '-'}</span>
        </div>
        <div className={s.result__content}>Your rewards:</div>
        {rewards?.length > 0 ? (
          <>
            {rewards.map(reward => (
              <Item data={{ ...reward, purchasable: false, price: 0 }} />
            ))}
          </>
        ) : (
          <div className={s.result__desc}>None :c</div>
        )}
        <Button label="Yay!" onClick={() => setIsOpen(false)} simple />
      </div>
    </Modal>
  );
};

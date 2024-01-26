import { useEffect, useState } from 'react';
import {
  Button,
  CurrencyInfo,
  Icon,
  IconType,
  Item,
  Modal,
  ProgressBar,
  Size,
  addCdnUrl,
  modifiers,
  useItemsApi,
  useMaterialsApi,
  useSettingsApi,
  useUpdateUserDailyQuestApi,
  useUpdateUserStoryQuestApi,
} from '@mhgo/front';
import {
  Currency,
  CurrencyType,
  Item as TItem,
  Quest,
  QuestPayment,
  Material,
} from '@mhgo/types';
import { useUser } from '../../hooks/useUser';

import s from './QuestView.module.scss';
import { getDidLevelUp } from '../../hooks/useUserLevelUp';
import { ModalLevelUp } from '../FightView/ModalLevelUp';

type QuestTileProps = {
  type: 'daily' | 'story';
  quest: Quest & { progress: number; questDate?: Date; isClaimed?: boolean };
};
export const QuestTile = ({ type, quest }: QuestTileProps) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isModalLevelUpOpen, setIsModalLevelUpOpen] = useState(false);

  const { userId } = useUser();
  const { data: items } = useItemsApi();
  const { data: materials } = useMaterialsApi();
  const { mutate: mutateUserDaily, data: levelsDaily } =
    useUpdateUserDailyQuestApi(userId);
  const { mutate: mutateUserStory, data: levelsStory } =
    useUpdateUserStoryQuestApi(userId);
  const { setting: currencies } = useSettingsApi('currency_types', [
    { id: 'base' as CurrencyType, icon: 'Question' as IconType },
    { id: 'premium' as CurrencyType, icon: 'Question' as IconType },
  ]);

  const onClaimButtonClick = () => {
    if (type === 'daily') setIsConfirmationModalOpen(true);
    else onClaimReward();
  };

  const onClaimReward = () => {
    setIsConfirmationModalOpen(false);
    if (type === 'daily')
      mutateUserDaily({
        questId: quest.id,
        progress: quest.progress,
        isClaimed: true,
      });
    if (type === 'story')
      mutateUserStory({
        questId: quest.id,
        progress: quest.progress,
        isClaimed: true,
      });
  };

  const isDone = quest.progress >= quest.maxProgress;
  const isClaimed = quest?.isClaimed;

  useEffect(() => {
    const { didLevelUp } = getDidLevelUp(
      type === 'story' ? levelsStory : levelsDaily,
    );
    if (didLevelUp) setIsModalLevelUpOpen(true);
  }, [levelsStory, levelsDaily]);

  return (
    <div className={modifiers(s, 'questView__quest', { isDone, isClaimed })}>
      <ModalDailyConfirm
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        onConfirm={onClaimReward}
        onClose={() => setIsConfirmationModalOpen(false)}
      />
      <ModalLevelUp
        levels={type === 'story' ? levelsStory : levelsDaily}
        isOpen={isModalLevelUpOpen}
        setIsOpen={setIsModalLevelUpOpen}
      />
      <div className={s.questView__section}>
        <img className={s.questView__img} src={addCdnUrl(quest.img)} />
        <div className={s.questView__details}>
          <h3 className={s.questView__questName}>{quest.title}</h3>
          <ProgressBar max={quest.maxProgress} current={quest.progress} />
        </div>
        {isDone && !isClaimed && (
          <Button
            label="Claim"
            variant={Button.Variant.ACTION}
            onClick={onClaimButtonClick}
            style={{ maxWidth: '100px', margin: 'auto 0 auto auto' }}
          />
        )}
        {isDone && isClaimed && (
          <img
            className={s.questView__claimed}
            src={addCdnUrl('/misc/claimed.png')}
          />
        )}
      </div>
      <div className={s.questView__section}>
        {getQuestMaterialReward(materials, quest)}
        {getQuestItemReward(items, quest)}
        <div className={s.questView__payment}>
          <div className={s.questView__exp}>
            <Icon icon="Paintball" size={Size.TINY} /> {quest.exp}
          </div>
          {getQuestPayment(currencies!, quest)}
        </div>
      </div>
    </div>
  );
};

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  onClose: () => void;
};
const ModalDailyConfirm = ({
  isOpen,
  setIsOpen,
  onConfirm,
  onClose,
}: ModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => {}}>
      <div className={s.modal}>
        <h1 className={s.modal__title}>Hold on a second!</h1>
        <div className={s.modal__content}>
          I have no way of checking if you ACTUALLY have done that daily quest.
          It's a matter of trust, you know. Are you 100000% sure that you
          deserve to claim that reward?
        </div>
        <Button
          label="I'm actually trying to cheat"
          variant={Button.Variant.DANGER}
          onClick={onClose}
          simple
        />
        <Button
          label="I solemnly swear I have finished this daily quest"
          variant={Button.Variant.ACTION}
          onClick={onConfirm}
          simple
        />
      </div>
    </Modal>
  );
};

const getQuestMaterialReward = (materials: Material[], quest: Quest) => {
  return quest.rewards
    .filter(reward => reward.type === 'material')
    .map(reward => {
      const material = materials.find(m => m.id === reward.id);
      if (material)
        return (
          <Item
            key={`material-${material.id}`}
            simple
            data={{
              ...material,
              amount: reward.amount,
              purchasable: false,
            }}
          />
        );
    });
};

const getQuestItemReward = (items: TItem[], quest: Quest) => {
  return quest.rewards
    .filter(reward => reward.type === 'item')
    .map(reward => {
      const item = items.find(m => m.id === reward.id);
      if (item)
        return (
          <Item
            key={`item-${item.id}`}
            simple
            data={{
              ...item,
              amount: reward.amount,
              purchasable: false,
            }}
          />
        );
    });
};

const getQuestPayment = (currencies: Currency[], quest: Quest) => {
  return currencies.map((currency: Currency) => {
    const payment: QuestPayment = quest.payment.find(
      p => p.id === currency.id,
    ) ?? {
      id: currency.id,
      amount: 0,
    };
    return (
      <CurrencyInfo
        key={`currency-${payment.id}`}
        price={{
          ...payment,
          ...currency,
        }}
      />
    );
  });
};

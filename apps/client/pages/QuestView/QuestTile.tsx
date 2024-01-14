import {
  Button,
  CurrencyInfo,
  IconType,
  Item,
  ProgressBar,
  addCdnUrl,
  modifiers,
  useItemsApi,
  useMaterialsApi,
  useSettingsApi,
} from '@mhgo/front';
import {
  Currency,
  CurrencyType,
  Item as TItem,
  Quest,
  QuestPayment,
  Material,
} from '@mhgo/types';

import s from './QuestView.module.scss';
import { toast } from 'react-toastify';

type QuestTileProps = {
  quest: Quest & { progress: number; questDate?: Date; isClaimed?: boolean };
};
export const QuestTile = ({ quest }: QuestTileProps) => {
  const { data: items } = useItemsApi();
  const { data: materials } = useMaterialsApi();
  const { setting: currencies } = useSettingsApi('currency_types', [
    { id: 'base' as CurrencyType, icon: 'Question' as IconType },
    { id: 'premium' as CurrencyType, icon: 'Question' as IconType },
  ]);

  const onClaimReward = () => {
    // TODO add claiming rewards from quests
    toast.info('Not implemented yet!');
  };

  const isDone = quest.progress === quest.maxProgress;
  const isClaimed = quest?.isClaimed;

  return (
    <div className={modifiers(s, 'questView__quest', { isDone, isClaimed })}>
      <div className={s.questView__section}>
        <img src={addCdnUrl(quest.img)} />
        <div className={s.questView__details}>
          <h3 className={s.questView__questName}>{quest.title}</h3>
          <ProgressBar max={quest.maxProgress} current={quest.progress} />
        </div>
        {isDone && !isClaimed && (
          <Button
            label="Claim"
            variant={Button.Variant.ACTION}
            onClick={onClaimReward}
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
          {getQuestPayment(currencies!, quest)}
        </div>
      </div>
    </div>
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
        price={{
          ...payment,
          ...currency,
        }}
      />
    );
  });
};

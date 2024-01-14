import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  CurrencyInfo,
  IconType,
  Item,
  ProgressBar,
  addCdnUrl,
  modifiers,
  useItemsApi,
  useMaterialsApi,
  useQuestsDailyApi,
  useSettingsApi,
  useUserQuestsDailyApi,
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
import { useUser } from '../../hooks/useUser';

dayjs.extend(relativeTime);

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestDailyView = () => {
  const { userQuestsWithDetails, dailyDate } = useQuestsDaily();
  const { data: items } = useItemsApi();
  const { data: materials } = useMaterialsApi();
  const { setting: currencies } = useSettingsApi('currency_types', [
    { id: 'base' as CurrencyType, icon: 'Question' as IconType },
    { id: 'premium' as CurrencyType, icon: 'Question' as IconType },
  ]);

  return (
    <div className={s.dailyView}>
      <div className={s.dailyView__header}>
        <div className={s.dailyView__title}>Daily Quests</div>
        <div className={s.dailyView__remaining}>
          Remaining: {dayjs(new Date()).to(dailyDate, true)}
        </div>
      </div>
      <div className={s.dailyView__list}>
        {userQuestsWithDetails.map(daily => {
          const isDone = daily.progress === daily.maxProgress;
          return (
            <div className={modifiers(s, 'dailyView__quest', { isDone })}>
              <div className={s.dailyView__section}>
                <img src={addCdnUrl(daily.img)} />
                <div className={s.dailyView__details}>
                  <h3 className={s.dailyView__questName}>{daily.title}</h3>
                  <ProgressBar
                    max={daily.maxProgress}
                    current={daily.progress}
                  />
                </div>
              </div>
              <div className={s.dailyView__section}>
                {getQuestMaterialReward(materials, daily)}
                {getQuestItemReward(items, daily)}
                <div className={s.dailyView__payment}>
                  {getQuestPayment(currencies!, daily)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const useQuestsDaily = () => {
  const { userId } = useUser();
  const { data: questsDaily } = useQuestsDailyApi();
  const { data: userQuestsDaily } = useUserQuestsDailyApi(userId);

  const userQuestsWithDetails = (userQuestsDaily?.daily ?? [])
    .map(userQuest => {
      const quest = questsDaily?.find(q => q.id === userQuest.id);
      if (!quest) return null;
      return {
        ...quest,
        ...userQuest,
      } as Quest & { progress: number };
    })
    .filter(Boolean) as (Quest & { progress: number; dailyDate: Date })[];

  return { userQuestsWithDetails, dailyDate: userQuestsDaily?.dailyDate };
};

const getQuestMaterialReward = (
  materials: Material[],
  daily: Quest & { progress: number; dailyDate: Date },
) => {
  return daily.rewards
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

const getQuestItemReward = (
  items: TItem[],
  daily: Quest & { progress: number; dailyDate: Date },
) => {
  return daily.rewards
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

const getQuestPayment = (
  currencies: Currency[],
  daily: Quest & { progress: number; dailyDate: Date },
) => {
  return currencies.map((currency: Currency) => {
    const payment: QuestPayment = daily.payment.find(
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

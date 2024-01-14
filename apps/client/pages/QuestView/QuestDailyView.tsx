import { useState } from 'react';
import {
  CloseButton,
  CurrencyInfo,
  IconType,
  Item,
  ProgressBar,
  addCdnUrl,
  useItemsApi,
  useMaterialsApi,
  useSettingsApi,
} from '@mhgo/front';

import s from './QuestView.module.scss';
import { Currency, CurrencyType } from '@mhgo/types';

export const TABS = {
  STORY: 'Story',
  DAILY: 'Daily',
};

export const QuestDailyView = () => {
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
        <div className={s.dailyView__remaining}>Remaining: 1h 26m</div>
      </div>
      <div className={s.dailyView__list}>
        {mock_daily.map(daily => (
          <div className={s.dailyView__quest}>
            <div className={s.dailyView__section}>
              <img src={addCdnUrl(daily.img)} />
              <div className={s.dailyView__details}>
                <h3 className={s.dailyView__questName}>{daily.title}</h3>
                <ProgressBar max={daily.maxProgress} current={0} />
              </div>
            </div>
            <div className={s.dailyView__section}>
              {daily.rewards
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
                })}
              {daily.rewards
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
                })}
              <div className={s.dailyView__payment}>
                {currencies!.map((currency: Currency) => {
                  const payment: DailyPayment = daily.payment.find(
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
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type DailyReward = {
  id: string;
  type: 'item' | 'material';
  amount: number;
};
type DailyPayment = {
  id: 'base' | 'premium';
  amount: number;
};
type QuestDaily = {
  title: string;
  img: string;
  maxProgress: number;
  rewards: DailyReward[];
  payment: DailyPayment[];
};

const mock_daily: QuestDaily[] = [
  {
    title: 'Pet Vilceł po nosie',
    img: '/misc/question.svg',
    maxProgress: 1,
    rewards: [{ id: 'potion', type: 'item', amount: 2 }],
    payment: [{ id: 'base', amount: 10 }],
  },
  {
    title: 'Do Norwegian homework',
    img: '/misc/question.svg',
    maxProgress: 1,
    rewards: [{ id: 'strawberry2', type: 'material', amount: 5 }],
    payment: [{ id: 'base', amount: 10 }],
  },
  {
    title: 'Go to siłownia',
    img: '/misc/question.svg',
    maxProgress: 1,
    rewards: [{ id: 'meat_slab', type: 'material', amount: 3 }],
    payment: [{ id: 'base', amount: 10 }],
  },
];

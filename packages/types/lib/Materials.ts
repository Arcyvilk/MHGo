import { CurrencyType } from './Wealth';
import { IsDisabled } from './_Misc';

export type Price = {
  type: CurrencyType;
  amount: number;
};

export type Material = IsDisabled & {
  id: string;
  img: string;
  name: string;
  description: string;
  rarity: number;
  filter: string;
};

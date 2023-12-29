import { CurrencyType } from './Wealth';

export type Price = {
  type: CurrencyType;
  amount: number;
};

export type Material = {
  id: string;
  img: string;
  name: string;
  description: string;
  rarity: number;
  filter: string;
};

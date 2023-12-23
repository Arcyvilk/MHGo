export type CurrencyType = 'base' | 'premium';
export type Currency = {
  id: CurrencyType;
  icon: string;
};
export const currencies: Currency[] = [
  {
    id: 'base',
    icon: 'Coin',
  },
  {
    id: 'premium',
    icon: 'Paw',
  },
];

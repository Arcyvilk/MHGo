import { CurrencyType } from './Wealth';

export type BaseWealth = {
  type: CurrencyType;
  amount: number;
};

export type Monster = {
  id: string;
  name: string;
  description: string;
  img: string; // URL of the fight image
  thumbnail: string; // URL of the map marker
  habitat: string;
  baseHP: number;
  baseDamage: number;
  baseAttackSpeed: number;
  baseExp: number;
  baseWealth: BaseWealth[];
};

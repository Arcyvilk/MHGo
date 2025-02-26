import { CurrencyType } from './Wealth';
import { IsDisabled } from './_Misc';

export type BaseWealth = {
  type: CurrencyType;
  amount: number;
};

export type Monster = IsDisabled & {
  id: string;
  name: string;
  description: string;
  img: string; // URL of the fight image
  thumbnail: string; // URL of the map marker
  biome: string;
  baseHP: number;
  baseDamage: number;
  baseAttackSpeed: number;
  baseExp: number;
  baseWealth: BaseWealth[];
  extinct: boolean;
  hideInGuide: boolean;
  levelRequirements: number | null;
};

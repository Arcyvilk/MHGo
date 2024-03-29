export type QuestReward = {
  id: string;
  type: 'item' | 'material';
  amount: number;
};

export type QuestPayment = {
  id: 'base' | 'premium';
  amount: number;
};

export type Quest = {
  id: string;
  title: string;
  img: string;
  maxProgress: number;
  rewards: QuestReward[];
  payment: QuestPayment[];
  exp: number;
  levelRequirement: number | null;
  enabled: boolean;
  requirements: QuestRequirement[];
};

export type QuestRequirement = {
  type: 'item' | 'material' | 'level';
  id: string;
};

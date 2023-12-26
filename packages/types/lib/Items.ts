export type ItemType = 'quest' | 'weapon' | 'armor' | 'other';

export type CraftType = 'item' | 'material';

export type CraftList = {
  id: string;
  craftType: CraftType;
  amount: number;
};

export type Item = {
  id: string;
  type: ItemType;
  img: string;
  name: string;
  description: string;
  rarity: number;
  price: number;
  purchasable: boolean;
  craftable: boolean;
  craftList: CraftList[];
  unique: boolean; // Can user have only one copy of an item at once
};

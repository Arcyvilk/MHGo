export enum ItemType {
  QUEST = 'quest',
  WEAPON = 'weapon',
  ARMOR = 'armor',
  OTHER = 'other',
}
export type CraftList = {
  id: string;
  type: 'item' | 'material';
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
};

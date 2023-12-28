export type ItemType = 'quest' | 'weapon' | 'armor' | 'other';

export type ItemSlot = 'weapon' | 'helmet' | 'chest' | 'arm' | 'waist' | 'leg';

export type CraftType = 'item' | 'material';

export type CraftList = {
  id: string;
  craftType: CraftType;
  amount: number;
};

export type Item = {
  id: string;
  type: ItemType;
  slot: ItemSlot | null;
  img: string;
  name: string;
  description: string;
  rarity: number;
  price: number;
  purchasable: boolean;
  craftable: boolean; // Can the item be crafted
  craftList: CraftList[];
  equippable: boolean; // Can the item be equipped (if owned)
  usable: boolean; // Can the item be used (if owned)
  unique: boolean; // Can user have only one copy of an item at once
  obtainedAt: string; // Short description of where this can be gotten from
};

export type ItemUses = {
  itemId: string;
  action: ItemActions;
};

export type ItemActions = {
  text?: string;
  redirect?: string;
};

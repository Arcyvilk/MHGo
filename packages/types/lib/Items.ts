import { UserAmount } from './User';

export type ItemType = 'quest' | 'weapon' | 'armor' | 'other';

export type ItemSlot = 'weapon' | 'helmet' | 'chest' | 'arm' | 'waist' | 'leg';

export type CraftType = 'item' | 'material';

export type Item = {
  id: string;
  type: ItemType;
  slot: ItemSlot | null;
  img: string;
  name: string;
  description: string;
  rarity: number;
  price?: UserAmount[]; // NOT in DB, merged with Item later
  purchasable: boolean;
  craftable: boolean; // Can the item be crafted
  craftList?: CraftList[]; // NOT in DB, merged with Item later
  equippable: boolean; // Can the item be equipped (if owned)
  usable: boolean; // Can the item be used (if owned)
  obtainedAt: string; // Short description of where this can be gotten from
  consumable: boolean; // Does the item disappear upon use
  quickUse: boolean; // Is the item present in the "quick use" menu
  levelRequirement: number | null; // From which level item appears in crafting menu
};

export type ItemActions = {
  itemId: string;
  action: ItemAction;
};

export type ItemAction = {
  text?: string;
  img?: string;
  redirect?: string;
  heal?: number;
};

export type ItemCraftList = {
  itemId: string;
  craftList: CraftList[];
};

export type CraftList = {
  id: string;
  craftType: CraftType;
  amount: number;
};

export type ItemCraftingList = {
  id: string;
  amount: number;
  userAmount: number;
};

export type ItemToUse = {
  itemId: string;
  amountUsed: number;
};

export type ItemPrice = {
  itemId: string;
  price: UserAmount[];
};

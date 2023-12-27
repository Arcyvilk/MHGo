import { ItemSlot } from './Items';

export type Loadout = { slot: ItemSlot; itemId: string };

export type UserLoadout = {
  userId: string;
  loadout: Loadout[];
};

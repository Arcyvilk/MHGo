export type LoadoutType =
  | 'weapon'
  | 'helmet'
  | 'torso'
  | 'gloves'
  | 'hips'
  | 'legs';

export type Loadout = { slot: LoadoutType; itemId: string };

export type UserLoadout = {
  userId: string;
  loadout: Loadout[];
};

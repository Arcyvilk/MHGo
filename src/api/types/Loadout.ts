export type LoadoutType =
  | 'weapon'
  | 'helmet'
  | 'torso'
  | 'gloves'
  | 'hips'
  | 'legs';

export type UserLoadout = {
  userId: string;
  loadout: { slot: LoadoutType; itemId: string }[];
};

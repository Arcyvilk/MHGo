// TODO temp user type
export type User = {
  name: string;
  id: string;
  pwdHash: string;
  avatar: string;
  exp: number;
  isAdmin: boolean;
  isAwaitingModApproval: boolean;
  isModApproved: boolean;
  progress: UserProgress;
  ban: UserBan;
  baseStats: UserStats;
};

export type UserStats = {
  attack: number;
  defense: number;
  health: number;
  element: string;
  luck: number;
  critChance: number;
  critDamage: number;
};

// TODO temp user progress type
export type UserProgress = {
  chapter: string;
  quest: string;
};

export type UserBan = {
  isBanned: boolean;
  endDate: Date;
};

export type UserAmount = { id: string; amount: number };

export type UserItems = {
  userId: string;
  items: UserAmount[];
};

export type UserMaterials = {
  userId: string;
  materials: UserAmount[];
};

export type UserWealth = {
  userId: string;
  wealth: UserAmount[];
};

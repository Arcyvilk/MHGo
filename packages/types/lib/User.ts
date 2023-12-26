// TODO temp user type
export type User = {
  name: string;
  id: string;
  pwdHash: string;
  avatar: string;
  exp: number;
  isAwaitingModApproval: boolean;
  isModApproved: boolean;
  progress: UserProgress;
  ban: UserBan;
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

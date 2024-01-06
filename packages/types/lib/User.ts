// TODO temp user type
export type User = {
  name: string;
  id: string;
  // TODO Don't send it from server ._.
  pwdHash: string;
  avatar: string;
  exp: number;
  isAdmin: boolean;
  isAwaitingModApproval: boolean;
  isModApproved: boolean;
  progress: UserProgress;
  ban: UserBan;
  wounds: number; // How much HP user lacks
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

export type UserRespawn = {
  userId: string;
  markerId: string;
  markerType: 'resource' | 'monster';
  usedAt: Date;
};

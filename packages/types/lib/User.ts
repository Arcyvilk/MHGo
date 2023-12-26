// TODO temp user type
export type User = {
  name: string;
  id: string;
  pwdHash: string;
  avatar: string;
  exp: number;
  progress: UserProgress;
};

// TODO temp user progress type
export type UserProgress = {
  chapter: number;
  quest: number;
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

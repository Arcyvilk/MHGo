export type User = {
  name: string;
  id: string;
  avatar: string;
  exp: number;
  wounds: number; // How much HP user lacks
  createdAt: Date;
};

export type UserAchievement = {
  achievementId: string;
  progress: number;
  unlockDate: Date | null;
};

export type UserAchievements = {
  userId: string;
  achievements: UserAchievement[];
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

// TODO temp user progress type
export type UserProgress = {
  chapter: string;
  quest: string;
};

export type UserRespawn = {
  userId: string;
  markerId: string;
  markerType: 'resource' | 'monster';
  usedAt: Date;
};

export type UserWealth = {
  userId: string;
  wealth: UserAmount[];
};

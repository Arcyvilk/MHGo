export type UserAuth = {
  userId: string;
  email: string;
  pwdHash: string;
  isAdmin: boolean;
  isAwaitingModApproval: boolean;
  isModApproved: boolean;
};

export type UserBan = {
  userId: string;
  isBanned: boolean;
  banReason: string;
  banEndDate: Date;
};

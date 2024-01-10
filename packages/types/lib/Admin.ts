import { UserAuth, UserBan } from './Auth';
import { User } from './User';

export type AdminUser = User &
  UserBan &
  Pick<UserAuth, 'isAdmin' | 'isAwaitingModApproval' | 'isModApproved'>;

export type UserResetType = {
  achievements?: boolean;
  basic?: boolean;
  items?: boolean;
  loadout?: boolean;
  materials?: boolean;
  wealth?: boolean;
  cooldowns?: boolean;
};

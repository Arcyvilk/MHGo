export type PackEntityType = 'item' | 'material';
export type PackType = 'starter' | 'godmode';

export type StarterPack = {
  entityType: PackEntityType;
  entityId: string;
  amount: number;
  packType: PackType;
};

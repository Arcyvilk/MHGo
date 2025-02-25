export type ChangeReview = {
  date: Date;
  changeType: 'delete';
  entityType: 'item' | 'material' | 'resource' | 'monster' | 'habitat';
  entityName: string;
  entityId: string;
  affectedEntities: ChangeAffectedEntity[];
};

export type ChangeAffectedEntity = {
  id: string;
  type: string;
  isApproved: boolean;
};

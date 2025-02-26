import { ChangeReview, ChangeType, EntityType } from '@mhgo/types';
import { mongoInstance } from '../../api';

export const addChangeReview = async (
  adventure: string,
  data: {
    affectedEntityId: string;
    affectedEntityType: EntityType;
    changedEntityId: string;
    changedEntityType: EntityType;
    changedEntityName: string;
    changeType: ChangeType;
    relation: string;
  },
) => {
  const changesToReview: ChangeReview = {
    // DATA
    affectedEntityId: data.affectedEntityId,
    affectedEntityType: data.affectedEntityType,
    changedEntityId: data.changedEntityId,
    changedEntityType: data.changedEntityType,
    changedEntityName: data.changedEntityName,
    changeType: data.changeType,
    relation: data.relation,
    // META
    date: new Date(),
    adminId: '',
    isApproved: false,
  };

  // Create a changeReview entry for all the changes
  const { db } = mongoInstance.getDb(adventure);
  const collectionChangeReview = db.collection<ChangeReview>('changeReview');
  await collectionChangeReview.insertOne(changesToReview);
};

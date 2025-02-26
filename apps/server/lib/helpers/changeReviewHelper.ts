import { ChangeReview, EntityType } from '@mhgo/types';
import { mongoInstance } from '../../api';

type ChangeReviewBasicData = Pick<
  ChangeReview,
  'changedEntityId' | 'changedEntityType' | 'changedEntityName' | 'changeType'
>;

/**
 * A helper function for creating the "change review" logs.
 * It takes the basic data about the changed entity as the main argument.
 * Data about the affected entities is added via addChangeReview function
 * which generates a single log per affected entity.
 *
 * This sounds way more complicated than it actually is: Consider the following:
 * - I am deleting an item "bone",
 * - monster Grandmaniath has item "bone" as a drop,
 * - item "bone mace" has item "bone" as a crafting ingridient.
 *
 * Upon deleting item "bone", we know all the info about it at the beginning,
 * and this will be the basicChangeReviewData as it will be shared with all the logs
 * about items affected with this change.
 *
 * Then when we encounter any entity that is affected by deletion of "bone", we
 * invoke the addChangeReview method and add the affected entity's data to the log.
 */
export const changeReviewHelper = (
  basicChangeReviewData: ChangeReviewBasicData,
) => {
  const addChangeReview = async (
    adventure: string,
    data: {
      affectedEntityId: string;
      affectedEntityType: EntityType;
      relation: string;
    },
  ) => {
    const changesToReview: ChangeReview = {
      // DATA
      affectedEntityId: data.affectedEntityId,
      affectedEntityType: data.affectedEntityType,
      relation: data.relation,
      // SHARED
      ...basicChangeReviewData,
      // META
      date: new Date(),
      adminId: '',
    };

    // Create a changeReview entry for all the changes
    const { db } = mongoInstance.getDb(adventure);
    const collectionChangeReview = db.collection<ChangeReview>('changeReview');
    await collectionChangeReview.insertOne(changesToReview);
  };

  return { addChangeReview };
};

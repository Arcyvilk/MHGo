import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

import { mongoInstance } from '../../../api';

/**
 * ChangeReview entries in the database are deleted upon approval,
 * so this pretty much means "approve change"
 */
export const adminDeleteChangeReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const { affectedEntityId } = req.params;

    if (!affectedEntityId)
      throw new Error('Requested affectedEntityId was not provided');

    // Delete basic user info
    const collectionChangeReview = db.collection('changeReview');
    const responseChangeReview = await collectionChangeReview.deleteMany({
      affectedEntityId,
    });
    if (!responseChangeReview.acknowledged)
      throw new Error(
        'Could not delete change reviews for the specified affectedEntityId.',
      );

    // Fin!
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};

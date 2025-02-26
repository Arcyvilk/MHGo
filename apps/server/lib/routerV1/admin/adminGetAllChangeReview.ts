import { Request, Response } from 'express';
import { log } from '@mhgo/utils';
import { ChangeReview } from '@mhgo/types';

import { mongoInstance } from '../../../api';

export const adminGetAllChangeReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb(res?.locals?.adventure);

    const collectionChangeReview = db.collection<ChangeReview>('changeReview');
    const changeReview = await collectionChangeReview
      .aggregate([
        // Ignore changelogs that are already approved
        { $match: { isApproved: false } },
        // Sort by newest
        { $sort: { date: -1 } },
        // Group by affectedEntityId
        {
          $group: { _id: '$affectedEntityId', documents: { $push: '$$ROOT' } },
        },
        // Project all the documents to their new places
        {
          $project: {
            _id: 0, // Remove _id
            affectedEntityId: '$_id', // Rename _id to affectedEntityId
            documents: 1, // Keep documents array
          },
        },
      ])
      .toArray();

    res.status(200).send(changeReview);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
